"use server";

import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { prisma } from "db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key";

export async function onUserLogin(
  email: string,
  password: string,
  fromConfirm = false,
) {
  // Step 1: Fetch user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValidFunc = async () => {
    if (fromConfirm) {
      return user.passwordHash === password;
    }
    return await compare(password, user.passwordHash);
  };
  const isPasswordValid = await isPasswordValidFunc();
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Step 3: Generate Access Token
  const accessToken = sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1h", // Access token expiration
    },
  );

  // Step 4: Generate Refresh Token
  const refreshToken = sign(
    {
      userId: user.id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d", // Refresh token expiration
    },
  );

  // Step 5: Return Both Tokens
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
