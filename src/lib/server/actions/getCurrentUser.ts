"use server";

import { getServerSession } from "next-auth";
import { headers } from "next/headers";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";

import { CreateUserOutputType } from "./types";
import { applyRateLimit, RateLimitError } from "@/lib/ratelimiter";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

export async function getCurrentUser(): Promise<CreateUserOutputType> {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      throw new Error("Not logged in!");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user as CreateUserOutputType;
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    throw error instanceof Error
      ? error
      : new Error("Failed to get current user");
  }
}
