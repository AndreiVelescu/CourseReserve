"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { headers } from "next/headers";
import { applyRateLimit } from "@/lib/ratelimiter";
import { logUserAction } from "../logs/logUserAction";
import { logHttpError } from "../logs/logHttpError";
import { UserRole } from "@prisma/client";
import { requireCourseInstructor } from "@/lib/route-helper";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

interface CreateGroupInput {
  name: string;
  description?: string;
  courseId: number;
  maxMembers?: number;
}

export async function createGroup(input: CreateGroupInput) {
  const url = "/api/groups/create";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");
    await requireCourseInstructor(input.courseId);

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(401, "POST", url, ip, "Unauthorized", userAgent);
      throw new Error("Not logged in!");
    }

    const currentUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true },
    });

    if (!currentUser) {
      await logHttpError(404, "POST", url, ip, "User not found", userAgent);
      throw new Error("User not found");
    }

    // Verifică permisiuni - doar INSTRUCTOR și ADMIN
    if (
      currentUser.role !== UserRole.INSTRUCTOR &&
      currentUser.role !== UserRole.ADMIN
    ) {
      await logHttpError(403, "POST", url, ip, "Forbidden", userAgent);
      throw new Error("Doar instructorii și adminii pot crea grupuri");
    }

    // Verifică dacă cursul există și permite grupuri
    const course = await prisma.course.findUnique({
      where: { id: input.courseId },
      select: {
        id: true,
        allowGroups: true,
        instructorId: true,
        title: true,
      },
    });

    if (!course) {
      throw new Error("Cursul nu a fost găsit");
    }

    if (!course.allowGroups) {
      throw new Error("Acest curs nu permite formarea de grupuri");
    }

    // Verifică dacă utilizatorul este instructor-ul cursului sau admin
    if (
      currentUser.role === UserRole.INSTRUCTOR &&
      course.instructorId !== currentUser.id
    ) {
      await logHttpError(
        403,
        "POST",
        url,
        ip,
        "Not course instructor",
        userAgent,
      );
      throw new Error("Doar instructorul cursului poate crea grupuri");
    }

    // Creează grupul
    const group = await prisma.group.create({
      data: {
        name: input.name,
        description: input.description,
        courseId: input.courseId,
        maxMembers: input.maxMembers || 10,
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    await logUserAction({
      userId: currentUser.id,
      actionType: "CREATE_GROUP",
      actionDetails: `Created group "${input.name}" for course "${course.title}"`,
      ipAddress: ip,
      userAgent,
    });

    return group;
  } catch (error) {
    await logHttpError(
      500,
      "POST",
      url,
      ip,
      error instanceof Error ? error.message : "Unknown error",
      userAgent,
    );
    throw error instanceof Error ? error : new Error("Failed to create group");
  }
}
