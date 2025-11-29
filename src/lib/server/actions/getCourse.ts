"use server";

import { prisma } from "db";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

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

export async function getCourseById(id: string) {
  const url = "/api/course/getCourseById";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
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

    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    if (!course) {
      await logHttpError(
        404,
        "GET",
        url,
        ip,
        `Course with id ${id} not found`,
        userAgent,
      );
      throw new Error("Course not found");
    }

    // Log acțiunea utilizatorului
    await logUserAction({
      userId: user?.id || null,
      actionType: "VIEW_COURSE",
      actionDetails: `Accessed course id: ${id}`,
      ipAddress: ip,
      userAgent,
    });

    return course;
  } catch (error: any) {
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

    throw error instanceof Error ? error : new Error("Failed to get course");
  }
}
