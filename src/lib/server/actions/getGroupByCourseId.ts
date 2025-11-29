// lib/server/actions/groups/getGroupsByCourseId.ts
"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { applyRateLimit } from "@/lib/ratelimiter";
import { headers } from "next/headers";
import { requireCourseInstructor } from "@/lib/route-helper";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

export async function getGroupsByCourseId(courseId: number) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");
    await requireCourseInstructor(courseId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not logged in!");
    }

    const groups = await prisma.group.findMany({
      where: {
        courseId,
        status: "ACTIVE",
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        course: {
          select: {
            title: true,
            instructorId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return groups;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to get groups");
  }
}
