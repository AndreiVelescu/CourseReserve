"use server";

import { prisma } from "db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { headers } from "next/headers";

import { UserTypeWithoutPass } from "./types";
import { logUserAction } from "../logs/logUserAction";
import { logAppError } from "../logs/logAppError";
import { logHttpError } from "../logs/logHttpError";

function getClientIP() {
  const forwarded = headers().get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getUserAgent() {
  return headers().get("user-agent") || "unknown";
}

export async function getUserById(id: number): Promise<UserTypeWithoutPass> {
  const url = "/api/user/getUserById";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(401, "GET", url, ip, "User not logged in", userAgent);
      throw new Error("Not logged in!");
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      await logHttpError(
        404,
        "GET",
        url,
        ip,
        `User with id ${id} not found`,
        userAgent,
      );
      throw new Error("User not found");
    }

    // Log acțiunea utilizatorului
    await logUserAction({
      userId: user?.id || null,
      actionType: "VIEW_USER",
      actionDetails: `Accessed user id: ${id}`,
      ipAddress: ip,
      userAgent,
    });

    return user as UserTypeWithoutPass;
  } catch (error: any) {
    await logAppError(error, url);

    if (!(error instanceof Error && error.message === "Not logged in!")) {
      await logHttpError(
        500,
        "GET",
        url,
        ip,
        error instanceof Error ? error.message : "Unknown server error",
        userAgent,
      );
    }

    throw error instanceof Error ? error : new Error("Failed to get user");
  }
}
