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

export async function deleteReservation(reservationId: number) {
  const url = "/api/reservation/deleteReservation";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(
        401,
        "DELETE",
        url,
        ip,
        "User not authenticated",
        userAgent,
      );
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logHttpError(404, "DELETE", url, ip, "User not found", userAgent);
      throw new Error("User not found");
    }

    // Verifică dacă rezervarea există și aparține utilizatorului
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        userId: user.id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!reservation) {
      await logHttpError(
        404,
        "DELETE",
        url,
        ip,
        `Reservation with id ${reservationId} not found or unauthorized`,
        userAgent,
      );
      throw new Error(
        "Rezervarea nu a fost găsită sau nu ai permisiunea să o ștergi",
      );
    }

    // Verifică dacă utilizatorul este într-un grup pentru acest curs
    const groupMembership = await prisma.groupMember.findFirst({
      where: {
        userId: user.id,
        group: {
          courseId: reservation.courseId,
        },
      },
      include: {
        group: {
          select: {
            name: true,
          },
        },
      },
    });

    if (groupMembership) {
      await logHttpError(
        400,
        "DELETE",
        url,
        ip,
        `User is member of group "${groupMembership.group.name}" for this course`,
        userAgent,
      );
      throw new Error(
        `Nu poți șterge rezervarea deoarece ești membru al grupului "${groupMembership.group.name}". Te rugăm să contactezi instructorul pentru a fi scos din grup mai întâi.`,
      );
    }

    // Șterge rezervarea
    await prisma.reservation.delete({
      where: {
        id: reservationId,
      },
    });

    // Log acțiune
    await logUserAction({
      userId: user.id,
      actionType: "DELETE_RESERVATION",
      actionDetails: JSON.stringify({
        reservationId,
        courseId: reservation.courseId,
        courseTitle: reservation.course.title,
      }),
      ipAddress: ip,
      userAgent,
    });

    return {
      success: true,
      message: "Rezervare ștearsă cu succes",
    };
  } catch (error: any) {
    if (error instanceof RateLimitError) {
      await logHttpError(
        429,
        "DELETE",
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
        "DELETE",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      );
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to delete reservation");
  }
}
