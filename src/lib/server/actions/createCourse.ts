"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { headers } from "next/headers";

import { CreateCourseInputType, CreateCourseOutputType } from "./types";
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

export async function createCourse(
  input: CreateCourseInputType,
): Promise<CreateCourseOutputType> {
  const url = "/api/course/createCourse";
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

    await prisma.course.create({
      data: {
        title: input.title,
        description: input.description,
        category: input.category,
        instructorId: input.instructorId,
        startDate: input.startDate,
        durationMinutes: input.durationMinutes,
      },
    });

    const createdCourse = await prisma.course.findFirst({
      where: {
        title: input.title,
        instructorId: input.instructorId,
      },
    });

    if (!createdCourse) {
      await logHttpError(
        500,
        "POST",
        url,
        ip,
        "Course creation failed",
        userAgent,
      );
      throw new Error("Course creation failed");
    }

    // Log acțiunea utilizatorului
    await logUserAction({
      userId: user?.id || null,
      actionType: "CREATE_COURSE",
      actionDetails: `Created course: ${input.title}`,
      ipAddress: ip,
      userAgent,
    });

    return createdCourse as unknown as CreateCourseOutputType;
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

    throw error instanceof Error ? error : new Error("Failed to create course");
  }
}
