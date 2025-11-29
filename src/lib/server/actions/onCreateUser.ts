"use server";

import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "db";

import { getEmailService } from "../util/emailService";

import { CreateUserInputType, CreateUserOutputType } from "./types";
import { UserRole } from "@prisma/client";

const saltRounds = 10;

export async function onCreateUser(
  input: CreateUserInputType,
): Promise<CreateUserOutputType> {
  const hashedPassword = await hash(input.password, saltRounds);

  const username = input.email.split("@")[0];

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: username }],
    },
  });

  if (existingUser) {
    throw new Error("User with this email or username already exists");
  }

  // Creează utilizatorul
  const user = await prisma.user.create({
    data: {
      username: username,
      email: input.email,
      passwordHash: hashedPassword,
      isActive: true,
      role: UserRole.STUDENT,
    },
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    isActive: user.isActive,
    createdAt: user.createdAt,
    role: user.role,
  };
}

const sendConfirmationEmail = async (email: string, hashedPassword: string) => {
  return getEmailService()
    .sendMail({
      to: email,
      subject: "Welcome to CourseReserve",
      text: `Welcome to CourseReserve platform`,
      from: process.env.SENDER_EMAIL,
      html: `<p>Welcome to CourseReserve! Your account has been created successfully. <a href="${process.env.NEXTAUTH_URL}/login">Click here</a> to log in.</p>`,
    })
    .catch((error: any) => {
      console.log(JSON.stringify(error));
    });
};

function generateConfirmationTokenUrl(email: string, password: string) {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

  const token = jwt.sign({ email, password }, JWT_SECRET, {
    expiresIn: "1h", // Token valid for 1 hour
  });

  return `${process.env.NEXTAUTH_URL}?token=${token}`;
}
