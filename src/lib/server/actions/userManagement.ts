// actions/admin/userManagement.ts
"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { applyRateLimit } from "@/lib/ratelimiter";
import { headers } from "next/headers";
import { hash } from "bcrypt";
import { logUserAction } from "../logs/logUserAction";
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

// Verifică dacă utilizatorul este admin
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, email: true, username: true },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized - Admin access required");
  }

  return user;
}

// ==========================================
// 1. CREATE USER
// ==========================================
interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

export async function createUser(input: CreateUserInput) {
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");
    const admin = await requireAdmin();

    // Verifică dacă username sau email există deja
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: input.username }, { email: input.email }],
      },
    });

    if (existingUser) {
      throw new Error("Username sau email există deja");
    }

    // Hash password
    const passwordHash = await hash(input.password, 10);

    // Creează user
    const newUser = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash,
        role: input.role,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        isActive: true,
      },
    });

    // Log acțiune
    await logUserAction({
      userId: admin.id,
      actionType: "CREATE_USER",
      actionDetails: JSON.stringify({
        createdUserId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      }),
      ipAddress: ip,
      userAgent,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error instanceof Error ? error : new Error("Failed to create user");
  }
}

// ==========================================
// 2. UPDATE USER
// ==========================================
interface UpdateUserInput {
  userId: number;
  username?: string;
  email?: string;
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  isActive?: boolean;
}

export async function updateUser(input: UpdateUserInput) {
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("Utilizatorul nu a fost găsit");
    }

    // Nu permite adminului să se dezactiveze pe sine
    if (input.userId === admin.id && input.isActive === false) {
      throw new Error("Nu te poți dezactiva pe tine însuți");
    }

    // Verifică username/email duplicate
    if (input.username || input.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: input.userId } },
            {
              OR: [
                input.username ? { username: input.username } : {},
                input.email ? { email: input.email } : {},
              ],
            },
          ],
        },
      });

      if (existingUser) {
        throw new Error("Username sau email există deja");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: input.userId },
      data: {
        ...(input.username && { username: input.username }),
        ...(input.email && { email: input.email }),
        ...(input.role && { role: input.role }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await logUserAction({
      userId: admin.id,
      actionType: "UPDATE_USER",
      actionDetails: JSON.stringify({
        updatedUserId: input.userId,
        changes: input,
      }),
      ipAddress: ip,
      userAgent,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error instanceof Error ? error : new Error("Failed to update user");
  }
}

// ==========================================
// 3. DELETE USER
// ==========================================
export async function deleteUser(userId: number) {
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reservations: true,
        instructorCourses: true,
        groupMemberships: true,
      },
    });

    if (!user) {
      throw new Error("Utilizatorul nu a fost găsit");
    }

    // Nu permite adminului să se șteargă pe sine
    if (userId === admin.id) {
      throw new Error("Nu te poți șterge pe tine însuți");
    }

    // Verifică dependențe
    if (user.instructorCourses.length > 0) {
      throw new Error(
        `Utilizatorul are ${user.instructorCourses.length} cursuri ca instructor. Șterge sau reasignează cursurile mai întâi.`,
      );
    }

    if (user.groupMemberships.length > 0) {
      throw new Error(
        "Utilizatorul este membru în grupuri. Elimină-l din grupuri mai întâi.",
      );
    }

    // Șterge utilizatorul (rezervările se șterg automat datorită onDelete: Cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    await logUserAction({
      userId: admin.id,
      actionType: "DELETE_USER",
      actionDetails: JSON.stringify({
        deletedUserId: userId,
        username: user.username,
        email: user.email,
        role: user.role,
      }),
      ipAddress: ip,
      userAgent,
    });

    return { success: true, message: "Utilizator șters cu succes" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error instanceof Error ? error : new Error("Failed to delete user");
  }
}

// ==========================================
// 4. GET USER DETAILS (cu toate relațiile)
// ==========================================
export async function getUserDetails(userId: number) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");
    await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reservations: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                category: true,
                startDate: true,
              },
            },
          },
        },
        instructorCourses: {
          select: {
            id: true,
            title: true,
            category: true,
            startDate: true,
            maxStudents: true,
          },
        },
        groupMemberships: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                courseId: true,
                status: true,
              },
            },
          },
        },
        userActionLogs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 50,
        },
      },
    });

    if (!user) {
      throw new Error("Utilizatorul nu a fost găsit");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      reservations: user.reservations.map((r) => ({
        id: r.id,
        courseId: r.courseId,
        courseTitle: r.course.title,
        courseCategory: r.course.category,
        reservedAt: r.reservedAt.toISOString(),
      })),
      instructorCourses: user.instructorCourses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        startDate: c.startDate.toISOString(),
        maxStudents: c.maxStudents,
      })),
      groupMemberships: user.groupMemberships.map((gm) => ({
        id: gm.id,
        groupId: gm.groupId,
        groupName: gm.group.name,
        courseId: gm.group.courseId,
        isLeader: gm.isLeader,
        joinedAt: gm.joinedAt.toISOString(),
      })),
      recentActivity: user.userActionLogs.map((log) => ({
        id: log.id,
        actionType: log.actionType,
        actionDetails: log.actionDetails,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error getting user details:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get user details");
  }
}

// ==========================================
// 5. EXPORT USERS (CSV/JSON)
// ==========================================
export async function exportUsers(format: "csv" | "json" = "json") {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            reservations: true,
            instructorCourses: true,
            groupMemberships: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (format === "csv") {
      const headers = [
        "ID",
        "Username",
        "Email",
        "Rol",
        "Activ",
        "Data Creare",
        "Rezervări",
        "Cursuri",
        "Grupuri",
      ];

      const rows = users.map((u) => [
        u.id,
        u.username,
        u.email,
        u.role,
        u.isActive ? "Da" : "Nu",
        new Date(u.createdAt).toLocaleDateString("ro-RO"),
        u._count.reservations,
        u._count.instructorCourses,
        u._count.groupMemberships,
      ]);

      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
        "\n",
      );

      return { format: "csv", data: csv };
    }

    return { format: "json", data: users };
  } catch (error) {
    console.error("Error exporting users:", error);
    throw error instanceof Error ? error : new Error("Failed to export users");
  }
}

// ==========================================
// 6. RESET USER PASSWORD
// ==========================================
export async function resetUserPassword(userId: number, newPassword: string) {
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    await applyRateLimit(ip, "api");
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Utilizatorul nu a fost găsit");
    }

    const passwordHash = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await logUserAction({
      userId: admin.id,
      actionType: "RESET_PASSWORD",
      actionDetails: JSON.stringify({
        targetUserId: userId,
        username: user.username,
      }),
      ipAddress: ip,
      userAgent,
    });

    return { success: true, message: "Parolă resetată cu succes" };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to reset password");
  }
}
