"use server";

import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "db";
import { headers } from "next/headers";

import { getEmailService } from "../util/emailService";
import { CreateUserInputType, CreateUserOutputType } from "./types";
import { UserRole } from "@prisma/client";

import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";

const saltRounds = 10;

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export async function onCreateUser(
  input: CreateUserInputType,
): Promise<CreateUserOutputType> {
  const url = "/api/user/createUser";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    const hashedPassword = await hash(input.password, saltRounds);
    const username = input.email.split("@")[0];

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: username }],
      },
    });

    if (existingUser) {
      await logHttpError(
        400,
        "POST",
        url,
        ip,
        "User already exists",
        userAgent,
      );
      throw new Error("User with this email or username already exists");
    }

    const user = await prisma.user.create({
      data: {
        username,
        email: input.email,
        passwordHash: hashedPassword,
        isActive: true,
        role: UserRole.STUDENT,
      },
    });

    // Log
    await logUserAction({
      userId: user.id,
      actionType: "CREATE_USER",
      actionDetails: `User created with email: ${input.email}`,
      ipAddress: ip,
      userAgent,
    });

    // Optional: trimite email de confirmare
    try {
      await getEmailService().sendMail({
        to: input.email,
        subject: "Welcome to CourseReserve",
        text: `Welcome to CourseReserve platform`,
        from: process.env.SENDER_EMAIL,
        html: `<p>Welcome to CourseReserve! Your account has been created successfully. <a href="${process.env.NEXTAUTH_URL}/login">Click here</a> to log in.</p>`,
      });
    } catch (emailError: any) {
      await logAppError(emailError, `${url} (sendEmail)`);
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      createdAt: user.createdAt,
      role: user.role,
    };
  } catch (error: any) {
    await logAppError(error, url);

    if (!(error instanceof Error && error.message.includes("already exists"))) {
      await logHttpError(
        500,
        "POST",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      );
    }

    throw error instanceof Error ? error : new Error("Failed to create user");
  }
}

// Funcție helper pentru generarea tokenului de confirmare (poate fi folosită ulterior)
export function generateConfirmationTokenUrl(email: string, password: string) {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  const token = jwt.sign({ email, password }, JWT_SECRET, { expiresIn: "1h" });
  return `${process.env.NEXTAUTH_URL}?token=${token}`;
}
