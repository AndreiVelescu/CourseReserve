"use server";

import { prisma } from "db";

import { CreateCourseInputType, CreateCourseOutputType } from "./types";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function createCourse(
  input: CreateCourseInputType,
): Promise<CreateCourseOutputType> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Not authenticated");
  }

  await prisma.course.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      instructorId: input.instructorId,
      startDate: input.startDate,
      durationMinutes: input.durationMinutes,
    },
  });
  const createdCourse = await prisma.course.findFirst({
    where: {
      title: input.title,
      instructorId: input.instructorId,
    },
  });

  if (!createdCourse) {
    throw new Error("Course creation failed");
  }

  return createdCourse as unknown as CreateCourseOutputType;
}
