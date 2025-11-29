"use server";

import { prisma } from "db";
import {
  CreateReservationInputType,
  CreateReservationOutputType,
} from "./types";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function createReservation(
  input: CreateReservationInputType,
): Promise<CreateReservationOutputType> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Not authenticated");
  }
  const existing = await prisma.reservation.findUnique({
    where: {
      userId_courseId: {
        userId: input.userId,
        courseId: input.courseId,
      },
    },
  });

  if (existing) {
    throw new Error("Ai deja o rezervare pentru acest curs!");
  }
  // Creează rezervarea pentru utilizatorul curent
  const reservation = await prisma.reservation.create({
    data: {
      courseId: input.courseId,
      userId: input.userId,
      reservedAt: input.reservedAt,
    },
    include: {
      course: true,
      user: true,
    },
  });

  return reservation as unknown as CreateReservationOutputType;
}
