"use server";

import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";

import { UserTypeWithoutPass } from "./types";

export async function updateUserById(data: {
  id: number;
  email: string;
  phone: string;
  role: string;
  confirmed: boolean;
  active: boolean;
}): Promise<UserTypeWithoutPass> {
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email;

  if (!sessionEmail) {
    throw new Error("Not logged in!");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      email: data.email,
      role: data.role as UserRole,
    },
  });

  return updatedUser as unknown as UserTypeWithoutPass;
}
