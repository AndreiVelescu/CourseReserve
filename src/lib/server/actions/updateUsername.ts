"use server";
import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function updateUsername(newUsername: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) throw new Error("Nu ești autentificat");

  const user = await prisma.user.update({
    where: { email },
    data: { username: newUsername },
  });

  return user;
}
