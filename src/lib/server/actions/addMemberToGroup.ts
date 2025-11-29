"use server";

import { prisma } from "db";
import { requireCourseInstructor } from "@/lib/route-helper";
import { applyRateLimit } from "@/lib/ratelimiter";
import { headers } from "next/headers";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

interface AddMemberToGroupInput {
  groupId: number;
  userId: number;
}

export async function addMemberToGroup(input: AddMemberToGroupInput) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");

    // Găsește grupul și cursul asociat
    const group = await prisma.group.findUnique({
      where: { id: input.groupId },
      include: {
        members: true,
        course: {
          select: {
            id: true,
            maxStudents: true,
          },
        },
      },
    });

    if (!group) {
      throw new Error("Grupul nu a fost găsit!");
    }

    await requireCourseInstructor(group.courseId);

    // Verifică dacă grupul este activ
    if (group.status !== "ACTIVE") {
      throw new Error("Nu poți adăuga membri într-un grup inactiv!");
    }

    // Verifică limita de membri
    if (group.maxMembers && group.members.length >= group.maxMembers) {
      throw new Error("Grupul a atins numărul maxim de membri!");
    }

    // Verifică dacă utilizatorul există și are rezervare la curs
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      include: {
        reservations: {
          where: {
            courseId: group.courseId,
          },
        },
        groupMemberships: {
          where: {
            group: {
              courseId: group.courseId,
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("Utilizatorul nu a fost găsit!");
    }

    // Verifică dacă utilizatorul are rezervare la curs
    if (user.reservations.length === 0) {
      throw new Error("Utilizatorul nu are rezervare la acest curs!");
    }

    // Verifică dacă utilizatorul este deja într-un grup pentru acest curs
    if (user.groupMemberships.length > 0) {
      throw new Error(
        "Utilizatorul este deja membru într-un grup pentru acest curs!",
      );
    }

    // ✅ TRANZACȚIE: Adaugă membru ȘI șterge rezervarea
    const result = await prisma.$transaction(async (tx) => {
      // 1. Adaugă membrul în grup
      const newMember = await tx.groupMember.create({
        data: {
          groupId: input.groupId,
          userId: input.userId,
          isLeader: group.members.length === 0, // Primul membru devine leader
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      // 2. Șterge rezervarea
      const deletedReservation = await tx.reservation.delete({
        where: {
          userId_courseId: {
            userId: input.userId,
            courseId: group.courseId,
          },
        },
      });

      console.log(
        `✅ Rezervare ștearsă pentru user ${input.userId} la cursul ${group.courseId}`,
      );

      return { newMember, deletedReservation };
    });

    // Log acțiune
    await prisma.userActionLog.create({
      data: {
        userId: input.userId,
        actionType: "JOIN_GROUP",
        actionDetails: JSON.stringify({
          groupId: input.groupId,
          groupName: group.name,
          courseId: group.courseId,
          reservationDeleted: true,
        }),
        ipAddress: ip,
      },
    });

    return result.newMember;
  } catch (error) {
    console.error("Error adding member to group:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to add member to group");
  }
}
