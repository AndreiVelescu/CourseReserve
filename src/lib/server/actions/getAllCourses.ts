"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";
import { getServerSession } from "next-auth";

export async function getAllCourses() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return await prisma.course.findMany();
}
