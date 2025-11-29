"use server";

import { prisma } from "db";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";
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

export async function getReservationById(id: string) {
  const url = "/api/reservation/getReservationById";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(
        401,
        "GET",
        url,
        ip,
        "User not authenticated",
        userAgent,
      );
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logHttpError(404, "GET", url, ip, "User not found", userAgent);
      throw new Error("User not found");
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        id: Number(id),
        user: { email },
      },
      include: {
        course: true,
      },
    });

    if (!reservation) {
      await logHttpError(
        404,
        "GET",
        url,
        ip,
        `Reservation with id ${id} not found`,
        userAgent,
      );
      throw new Error("Rezervarea nu a fost găsită");
    }

    await logUserAction({
      userId: user?.id || null,
      actionType: "VIEW_RESERVATION",
      actionDetails: `Accessed reservation id: ${id}`,
      ipAddress: ip,
      userAgent,
    });

    return {
      id: reservation.id,
      userId: reservation.userId,
      courseId: reservation.courseId,
      reservedAt: reservation.reservedAt,
      course: {
        id: reservation.course.id,
        title: reservation.course.title,
        description: reservation.course.description,
        category: reservation.course.category,
        durationMinutes: reservation.course.durationMinutes,
        startDate: reservation.course.startDate.toISOString(),
      },
    };
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

    await logAppError(error, url);

    if (!(error instanceof Error && error.message === "Not authenticated")) {
      await logHttpError(
        500,
        "GET",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      );
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to get reservation");
  }
}
