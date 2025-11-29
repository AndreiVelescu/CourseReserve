"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";

import { UserTypeWithoutPass } from "./types";
import { getServerSession } from "next-auth";

export async function deleteUserById(id: number): Promise<UserTypeWithoutPass> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Not logged in!");
  }

  await prisma.course.deleteMany({
    where: {
      id: id,
    },
  });

  const deleteUser = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return deleteUser as unknown as UserTypeWithoutPass;
}
