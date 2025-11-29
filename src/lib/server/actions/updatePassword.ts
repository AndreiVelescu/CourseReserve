"use server";
import { prisma } from "db";
import { getServerSession } from "next-auth";
import { hash, compare } from "bcrypt";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function updatePassword(newPassword: string, oldPassword: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) throw new Error("Nu ești autentificat");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValidFunc = async () => {
    return await compare(oldPassword, user.passwordHash);
  };

  const isPasswordValid = await isPasswordValidFunc();

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const hashedPassword = await hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash: hashedPassword },
  });

  return true;
}
