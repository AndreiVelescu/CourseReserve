"use server";
import { prisma } from "db";

import { getServerSession } from "next-auth";
import { UserTypeWithoutPass } from "./types";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function getUserById(id: number): Promise<UserTypeWithoutPass> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Not logged in!");
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user as unknown as UserTypeWithoutPass;
}
