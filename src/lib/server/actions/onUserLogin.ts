"use server";

import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "db";
import { headers } from "next/headers";

import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export async function onUserLogin(
  email: string,
  password: string,
  fromConfirm = false,
) {
  const url = "/api/user/login";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      await logHttpError(404, "POST", url, ip, "User not found", userAgent);
      await logUserAction({
        userId: null,
        actionType: "LOGIN_FAILED",
        actionDetails: `Login attempt with email: ${email}`,
        ipAddress: ip,
        userAgent,
      });
      throw new Error("User not found");
    }

    const isPasswordValid = fromConfirm
      ? user.passwordHash === password
      : await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      await logHttpError(
        400,
        "POST",
        url,
        ip,
        "Invalid credentials",
        userAgent,
      );
      await logUserAction({
        userId: user.id,
        actionType: "LOGIN_FAILED",
        actionDetails: `Invalid password attempt`,
        ipAddress: ip,
        userAgent,
      });
      throw new Error("Parolă incorectă");
    }

    // Generare tokenuri
    const accessToken = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = sign(
      {
        userId: user.id,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    // Log login reușit
    await logUserAction({
      userId: user.id,
      actionType: "LOGIN_SUCCESS",
      actionDetails: "User logged in successfully",
      ipAddress: ip,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    await logAppError(error, url);

    if (!(error instanceof Error && error.message === "Parolă incorectă")) {
      await logHttpError(
        500,
        "POST",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      );
    }

    throw error instanceof Error ? error : new Error("Failed to login");
  }
}
