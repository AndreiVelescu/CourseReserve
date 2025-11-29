"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { headers } from "next/headers";

import {
  CreateReservationInputType,
  CreateReservationOutputType,
} from "./types";
import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
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

export async function createReservation(
  input: CreateReservationInputType,
): Promise<CreateReservationOutputType> {
  const url = "/api/reservation/createReservation";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
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
      throw new Error("Not authenticated");
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logHttpError(404, "POST", url, ip, "User not found", userAgent);
      throw new Error("User not found");
    }

    const existing = await prisma.reservation.findUnique({
      where: {
        userId_courseId: {
          userId: input.userId,
          courseId: input.courseId,
        },
      },
    });

    if (existing) {
      await logHttpError(
        409,
        "POST",
        url,
        ip,
        "Reservation already exists for this course",
        userAgent,
      );
      throw new Error("Ai deja o rezervare pentru acest curs!");
    }

    const reservation = await prisma.reservation.create({
      data: {
        courseId: input.courseId,
        userId: input.userId,
        reservedAt: input.reservedAt,
      },
      include: {
        course: true,
        user: true,
      },
    });

    // Log acțiunea utilizatorului
    await logUserAction({
      userId: user?.id || null,

      actionType: "CREATE_RESERVATION",
      actionDetails: `Created reservation for courseId: ${input.courseId}`,
      ipAddress: ip,
      userAgent,
    });

    return reservation as unknown as CreateReservationOutputType;
  } catch (error: any) {
    await logAppError(error, url);

    if (!(error instanceof Error && error.message === "Not authenticated")) {
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
      : new Error("Failed to create reservation");
  }
}
