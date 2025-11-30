// actions/user/getUserGroups.ts
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

export async function getUserGroups() {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const groupMemberships = await prisma.groupMember.findMany({
      where: {
        userId: user.id,
      },
      include: {
        group: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                category: true,
                startDate: true,
                durationMinutes: true,
              },
            },
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
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    const result = groupMemberships.map((gm) => ({
      id: gm.id,
      groupId: gm.groupId,
      groupName: gm.group.name,
      groupDescription: gm.group.description,
      groupStatus: gm.group.status,
      isLeader: gm.isLeader,
      joinedAt: gm.joinedAt.toISOString(),
      course: {
        id: gm.group.course.id,
        title: gm.group.course.title,
        category: gm.group.course.category,
        startDate: gm.group.course.startDate.toISOString(),
        durationMinutes: gm.group.course.durationMinutes,
      },
      members: gm.group.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        username: m.user.username,
        email: m.user.email,
        isLeader: m.isLeader,
        joinedAt: m.joinedAt.toISOString(),
      })),
      memberCount: gm.group.members.length,
      maxMembers: gm.group.maxMembers,
    }));

    return result;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to get user groups");
  }
}

export async function getUserActivity() {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const activities = await prisma.userActionLog.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const result = activities.map((activity) => ({
      id: activity.id,
      actionType: activity.actionType,
      actionDetails: activity.actionDetails,
      ipAddress: activity.ipAddress,
      createdAt: activity.createdAt.toISOString(),
    }));

    return result;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to get user activity");
  }
}

export async function getUserStats() {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        reservations: {
          include: {
            course: {
              select: {
                startDate: true,
              },
            },
          },
        },
        groupMemberships: true,
        instructorCourses: {
          include: {
            reservations: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();

    const stats = {
      reservations: user.reservations.length,
      groups: user.groupMemberships.length,
      coursesAsInstructor: user.instructorCourses.length,
      totalStudentsInCourses: user.instructorCourses.reduce(
        (sum, course) => sum + course.reservations.length,
        0,
      ),
      completedCourses: user.reservations.filter(
        (r) => new Date(r.course.startDate) < now,
      ).length,
      upcomingCourses: user.reservations.filter(
        (r) => new Date(r.course.startDate) >= now,
      ).length,
    };

    return stats;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to get user stats");
  }
}
