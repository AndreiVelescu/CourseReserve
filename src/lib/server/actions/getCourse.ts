"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";
import { getServerSession } from "next-auth";

export async function getCourseById(id: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Not authenticated");
  }

  return await prisma.course.findUnique({
    where: {
      id: Number(id),
    },
  });
}
