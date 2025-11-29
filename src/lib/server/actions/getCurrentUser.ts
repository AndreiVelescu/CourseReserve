"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";

import { CreateUserOutputType, UserTypeWithoutPass } from "./types";

export async function getCurrentUser(): Promise<CreateUserOutputType> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Not logged in!");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      passwordHash: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user as unknown as CreateUserOutputType;
}
