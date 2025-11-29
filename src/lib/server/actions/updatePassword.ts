"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { hash, compare } from "bcrypt";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";

import { applyRateLimit, RateLimitError } from "@/lib/ratelimiter";

import { headers } from "next/headers";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export async function updatePassword(newPassword: string, oldPassword: string) {
  const url = "/api/user/updatePassword";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "auth");

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(
        401,
        "POST",
        url,
        ip,
        "User not authenticated",
        userAgent,
      );
      throw new Error("Nu ești autentificat");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logHttpError(404, "POST", url, ip, "User not found", userAgent);
      throw new Error("User not found");
    }

    const isPasswordValid = await compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      await logHttpError(
        400,
        "POST",
        url,
        ip,
        "Old password incorrect",
        userAgent,
      );
      throw new Error("Parola veche este greșită");
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    await logUserAction({
      userId: user?.id || null,
      actionType: "UPDATE_PASSWORD",
      actionDetails: "User updated their password",
      ipAddress: ip,
      userAgent,
    });

    return true;
  } catch (error: any) {
    if (error instanceof RateLimitError) {
      await logHttpError(
        429,
        "POST",
        url,
        ip,
        `Rate limit exceeded: ${error.message}`,
        userAgent,
      );
      throw error;
    }

    await logAppError(error, url);

    if (
      !(
        error instanceof Error && error.message.includes("Nu ești autentificat")
      )
    ) {
      await logHttpError(
        500,
        "POST",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      );
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to update password");
  }
}
