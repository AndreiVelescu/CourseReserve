"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
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

export async function updateUsername(newUsername: string) {
  const url = "/api/user/updateUsername";
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

    const user = await prisma.user.update({
      where: { email },
      data: { username: newUsername },
    });

    await logUserAction({
      userId: user?.id || null,
      actionType: "UPDATE_USERNAME",
      actionDetails: `New username: ${newUsername}`,
      ipAddress: ip,
      userAgent: userAgent,
    });

    return user;
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
      throw new Error("Prea multe cereri, încearcă din nou mai târziu.");
    }

    await logAppError(error, url);

    if (!(error instanceof Error && error.message === "Nu ești autentificat")) {
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
      : new Error("Failed to update username");
  }
}
