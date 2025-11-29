"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";
import { getServerSession } from "next-auth";
import { CreateCourseOutputType } from "./types";

export type ReservationWithCourse = {
  id: number;
  userId: number;
  courseId: number;
  reservedAt: Date;
  course: CreateCourseOutputType;
};

export async function getAllReservations(): Promise<
  ReservationWithCourse[] | null
> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return await prisma.reservation.findMany({
    where: {
      user: {
        email,
      },
    },
    include: {
      course: true,
    },
  });
}
