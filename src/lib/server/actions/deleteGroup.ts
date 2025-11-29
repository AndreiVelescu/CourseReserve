// lib/server/actions/groups/deleteGroup.ts
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

export async function deleteGroup(groupId: number) {
  const url = "/api/groups/delete";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");
    const grupik = await prisma.group.findUnique({
      where: { id: groupId },
      select: { courseId: true },
    });
    if (!grupik) {
      throw new Error("Group not found");
    }
    await requireCourseInstructor(grupik.courseId);

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(401, "DELETE", url, ip, "Unauthorized", userAgent);
      throw new Error("Not logged in!");
    }

    const currentUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!group) {
      throw new Error("Grupul nu a fost găsit");
    }

    const isInstructor = group.course.instructorId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isInstructor && !isAdmin) {
      await logHttpError(403, "DELETE", url, ip, "Forbidden", userAgent);
      throw new Error("Doar instructorul sau adminul pot șterge grupul");
    }

    await prisma.group.delete({
      where: { id: groupId },
    });

    await logUserAction({
      userId: currentUser.id,
      actionType: "DELETE_GROUP",
      actionDetails: `Deleted group "${group.name}"`,
      ipAddress: ip,
      userAgent,
    });

    return { success: true };
  } catch (error) {
    await logHttpError(
      500,
      "DELETE",
      url,
      ip,
      error instanceof Error ? error.message : "Unknown error",
      userAgent,
    );
    throw error instanceof Error ? error : new Error("Failed to delete group");
  }
}
