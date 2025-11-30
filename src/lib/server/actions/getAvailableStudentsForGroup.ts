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

export async function getAvailableStudentsForGroup(
  courseId: number,
  groupId?: number,
) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not logged in!");
    }

    // Verifică dacă utilizatorul este instructor sau admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (
      !currentUser ||
      (currentUser.role !== "INSTRUCTOR" && currentUser.role !== "ADMIN")
    ) {
      throw new Error("Nu ai permisiunea de a accesa această resursă!");
    }

    // Step 1: Găsește toate rezervările pentru acest curs
    const reservations = await prisma.reservation.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const users = reservations.map((r) => r.user);

    // Dacă nu avem groupId, returnăm toți utilizatorii
    if (!groupId) {
      return users;
    }

    // Step 2: Găsește membrii grupului curent
    const groupMembers = await prisma.groupMember.findMany({
      where: {
        groupId: groupId,
      },
      select: {
        userId: true,
      },
    });

    const memberIds = groupMembers.map((m) => m.userId);

    // Step 3: Filtrează utilizatorii care NU sunt în grup
    const availableUsers = users.filter((user) => !memberIds.includes(user.id));

    return availableUsers;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to get available students");
  }
}
