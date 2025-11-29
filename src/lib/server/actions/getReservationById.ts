"use server";
import { prisma } from "db";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function getReservationById(id: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Not authenticated");
  }

  const reservation = await prisma.reservation.findFirst({
    where: {
      id: Number(id),
      user: { email },
    },
    include: {
      course: true,
    },
  });

  if (!reservation) {
    throw new Error("Rezervarea nu a fost găsită");
  }

  return {
    id: reservation.id,
    userId: reservation.userId,
    courseId: reservation.courseId,
    reservedAt: reservation.reservedAt,

    course: {
      id: reservation.course.id,
      title: reservation.course.title,
      description: reservation.course.description,
      category: reservation.course.category,
      durationMinutes: reservation.course.durationMinutes,
      startDate: reservation.course.startDate.toISOString(),
    },
  };
}
