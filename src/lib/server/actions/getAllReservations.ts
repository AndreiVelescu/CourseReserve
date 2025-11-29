"use server";

import { prisma } from "db";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

import { CreateCourseOutputType } from "./types";
import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";
import { applyRateLimit, RateLimitError } from "@/lib/ratelimiter";

export type ReservationWithCourse = {
  id: number;
  userId: number;
  courseId: number;
  reservedAt: Date;
  course: CreateCourseOutputType;
};

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export async function getAllReservations(): Promise<
  ReservationWithCourse[] | null
> {
  const url = "/api/reservation/getAllReservations";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    const rateLimitInfo = await applyRateLimit(ip, "api");
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
      return null;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logHttpError(404, "GET", url, ip, "User not found", userAgent);
      return null;
    }

    const reservations = await prisma.reservation.findMany({
      where: { user: { email } },
      include: { course: true },
    });

    // Log acțiunea utilizatorului
    await logUserAction({
      userId: user?.id || null,
      actionType: "VIEW_RESERVATIONS",
      actionDetails: `Fetched all reservations for user`,
      ipAddress: ip,
      userAgent,
    });

    return reservations as ReservationWithCourse[];
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
    } else {
      await logAppError(error, url);
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to fetch reservations");
  }
}
