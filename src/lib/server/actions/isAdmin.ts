"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UserRole } from "@prisma/client";
import { prisma } from "db";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { applyRateLimit, RateLimitError } from "@/lib/ratelimiter";
import { logHttpError } from "../logs/logHttpError";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export const isAdmin = async (): Promise<boolean> => {
  const url = "/api/user/isAdmin";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "auth");

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return false;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return false;
    }

    return user.role === UserRole.ADMIN;
  } catch (error: any) {
    if (error instanceof RateLimitError) {
      await logHttpError(
        429,
        "GET",
        url,
        ip,
        `Rate limit exceeded: ${error.message}`,
        userAgent,
      );
      throw error;
    }
    throw error;
  }
};
