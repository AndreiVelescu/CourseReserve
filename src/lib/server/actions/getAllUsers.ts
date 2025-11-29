"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { headers } from "next/headers";

import { UserTypeWithoutPassForAdmin } from "./types";
import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";
import { UserRole } from "@prisma/client";

import { applyRateLimit, RateLimitError } from "@/lib/ratelimiter";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export async function getAllUsers(): Promise<UserTypeWithoutPassForAdmin[]> {
  const url = "/api/admin/getAllUsers";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "admin");

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      logHttpError(401, "GET", url, ip, "User not logged in", userAgent).catch(
        console.error,
      );
      throw new Error("Not logged in!");
    }

    const currentUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true },
    });

    if (!currentUser) {
      logHttpError(
        404,
        "GET",
        url,
        ip,
        `User with email ${email} not found`,
        userAgent,
      ).catch(console.error);
      throw new Error("User not found");
    }

    // 3️⃣ Verifică dacă este ADMIN
    if (currentUser.role !== UserRole.ADMIN) {
      logHttpError(
        403,
        "GET",
        url,
        ip,
        `Access to admin area forbidden for user ${email}`,
        userAgent,
      ).catch(console.error);
      throw new Error("Access to admin user is forbidden");
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        reservations: {
          select: {
            id: true,
            reservedAt: true,
            courseName: true,
            courseId: true,
          },
        },
        userActionLogs: true,
        instructorCourses: true,
      },
    });

    // Log accesul
    logUserAction({
      userId: currentUser.id,
      actionType: "VIEW_USERS",
      actionDetails: `Admin ${email} accessed all users`,
      ipAddress: ip,
      userAgent,
    }).catch(console.error);

    return users as unknown as UserTypeWithoutPassForAdmin[];
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

    logAppError(error, url).catch(console.error);

    if (!(error instanceof Error && error.message === "Not logged in!")) {
      logHttpError(
        500,
        "GET",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      ).catch(console.error);
    }

    throw error instanceof Error ? error : new Error("Failed to get users");
  }
}
