"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { applyRateLimit } from "@/lib/ratelimiter";
import { headers } from "next/headers";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized - Admin access required");
  }

  return user;
}

export async function getAppErrorLogs(limit: number = 100) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");
    await requireAdmin();

    const logs = await prisma.appErrorLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return logs.map((log) => ({
      id: log.id,
      errorType: log.errorType,
      message: log.message,
      stackTrace: log.stackTrace,
      url: log.url,
      createdAt: log.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error getting app error logs:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get app error logs");
  }
}

export async function getHttpErrorLogs(limit: number = 100) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");
    await requireAdmin();

    const logs = await prisma.httpErrorLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return logs.map((log) => ({
      id: log.id,
      statusCode: log.statusCode,
      method: log.method,
      url: log.url,
      ipAddress: log.ipAddress,
      message: log.message,
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error getting HTTP error logs:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get HTTP error logs");
  }
}

export async function getLogStatistics() {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");
    await requireAdmin();

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalAppErrors,
      appErrorsLast24h,
      appErrorsLast7Days,
      totalHttpErrors,
      httpErrorsLast24h,
      httpErrorsLast7Days,
    ] = await Promise.all([
      prisma.appErrorLog.count(),
      prisma.appErrorLog.count({
        where: { createdAt: { gte: last24Hours } },
      }),
      prisma.appErrorLog.count({
        where: { createdAt: { gte: last7Days } },
      }),
      prisma.httpErrorLog.count(),
      prisma.httpErrorLog.count({
        where: { createdAt: { gte: last24Hours } },
      }),
      prisma.httpErrorLog.count({
        where: { createdAt: { gte: last7Days } },
      }),
    ]);

    // Grupează HTTP errors după status code
    const httpErrorsByStatus = await prisma.httpErrorLog.groupBy({
      by: ["statusCode"],
      _count: {
        statusCode: true,
      },
      where: {
        createdAt: { gte: last7Days },
      },
    });

    return {
      appErrors: {
        total: totalAppErrors,
        last24Hours: appErrorsLast24h,
        last7Days: appErrorsLast7Days,
      },
      httpErrors: {
        total: totalHttpErrors,
        last24Hours: httpErrorsLast24h,
        last7Days: httpErrorsLast7Days,
      },
      httpErrorsByStatus: httpErrorsByStatus.map((item) => ({
        statusCode: item.statusCode,
        count: item._count.statusCode,
      })),
    };
  } catch (error) {
    console.error("Error getting log statistics:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get log statistics");
  }
}

export async function clearOldLogs(daysToKeep: number = 30) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");
    await requireAdmin();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const [deletedAppLogs, deletedHttpLogs] = await Promise.all([
      prisma.appErrorLog.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
        },
      }),
      prisma.httpErrorLog.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
        },
      }),
    ]);

    return {
      success: true,
      deletedAppLogs: deletedAppLogs.count,
      deletedHttpLogs: deletedHttpLogs.count,
    };
  } catch (error) {
    console.error("Error clearing old logs:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to clear old logs");
  }
}
