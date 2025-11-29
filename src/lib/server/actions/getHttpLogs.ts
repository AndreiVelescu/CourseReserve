// lib/server/actions/getAllUserLogs.ts
"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { headers } from "next/headers";
import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";
import { UserActionLog, UserRole } from "@prisma/client";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export async function getAllUserLogs(): Promise<UserActionLog[]> {
  const url = "/api/admin/getAllUserLogs";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(401, "GET", url, ip, "User not logged in", userAgent);
      throw new Error("Not logged in!");
    }

    const currentUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true },
    });

    if (!currentUser) {
      await logHttpError(
        404,
        "GET",
        url,
        ip,
        `User with email ${email} not found`,
        userAgent,
      );
      throw new Error("User not found");
    }

    // Verifică dacă este ADMIN
    if (currentUser.role !== UserRole.ADMIN) {
      await logHttpError(
        403,
        "GET",
        url,
        ip,
        `Access forbidden for user ${email}`,
        userAgent,
      );
      throw new Error("Access forbidden");
    }

    // Obține toate log-urile
    const allLogs = await prisma.userActionLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000, // Limitează la ultimele 1000 de intrări pentru performanță
    });

    await logUserAction({
      userId: currentUser.id,
      actionType: "VIEW_ALL_USER_LOGS",
      actionDetails: `Admin ${email} accessed all user logs`,
      ipAddress: ip,
      userAgent,
    });

    return allLogs;
  } catch (error: any) {
    await logAppError(error, url);

    if (
      !(
        error instanceof Error &&
        (error.message === "Not logged in!" ||
          error.message === "Access forbidden")
      )
    ) {
      await logHttpError(
        500,
        "GET",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      );
    }

    throw error instanceof Error ? error : new Error("Failed to get logs");
  }
}
