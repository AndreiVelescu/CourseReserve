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

interface RemoveMemberFromGroupInput {
  groupId: number;
  userId: number;
  restoreReservation?: boolean; // Opțional: restaurează rezervarea
}

export async function removeMemberFromGroup(input: RemoveMemberFromGroupInput) {
  const ip = getClientIP();

  try {
    await applyRateLimit(ip, "api");

    const group = await prisma.group.findUnique({
      where: { id: input.groupId },
      select: {
        id: true,
        courseId: true,
        name: true,
      },
    });

    if (!group) {
      throw new Error("Grupul nu a fost găsit!");
    }

    // ✅ Verifică autorizarea
    await requireCourseInstructor(group.courseId);

    // Verifică dacă membrul există
    const member = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: input.groupId,
          userId: input.userId,
        },
      },
    });

    if (!member) {
      throw new Error("Utilizatorul nu este membru al acestui grup!");
    }

    // ✅ TRANZACȚIE: Elimină membru ȘI (opțional) restaurează rezervarea
    const result = await prisma.$transaction(async (tx) => {
      // 1. Șterge membru din grup
      await tx.groupMember.delete({
        where: {
          groupId_userId: {
            groupId: input.groupId,
            userId: input.userId,
          },
        },
      });

      console.log(
        `✅ Membru ${input.userId} eliminat din grupul ${input.groupId}`,
      );

      // 2. Restaurează rezervarea (dacă e solicitat)
      let restoredReservation = null;
      if (input.restoreReservation !== false) {
        // Default: true
        // Verifică dacă rezervarea nu există deja
        const existingReservation = await tx.reservation.findUnique({
          where: {
            userId_courseId: {
              userId: input.userId,
              courseId: group.courseId,
            },
          },
        });

        if (!existingReservation) {
          restoredReservation = await tx.reservation.create({
            data: {
              userId: input.userId,
              courseId: group.courseId,
            },
          });

          console.log(
            `✅ Rezervare restaurată pentru user ${input.userId} la cursul ${group.courseId}`,
          );
        }
      }

      return { memberRemoved: true, restoredReservation };
    });

    // Log acțiune
    await prisma.userActionLog.create({
      data: {
        userId: input.userId,
        actionType: "LEAVE_GROUP",
        actionDetails: JSON.stringify({
          groupId: input.groupId,
          groupName: group.name,
          courseId: group.courseId,
          reservationRestored: !!result.restoredReservation,
        }),
        ipAddress: ip,
      },
    });

    return result;
  } catch (error) {
    console.error("Error removing member from group:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to remove member from group");
  }
}
