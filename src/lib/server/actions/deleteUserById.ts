"use server";

import { prisma } from "db";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
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

export async function deleteUserById(id: number): Promise<UserTypeWithoutPass> {
  const url = "/api/user/deleteUserById";
  const ip = getClientIP();
  const userAgent = getUserAgent();

  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      await logHttpError(401, "DELETE", url, ip, "Not logged in", userAgent);
      throw new Error("Not logged in!");
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logHttpError(404, "DELETE", url, ip, "User not found", userAgent);
      throw new Error("User not found");
    }

    // Șterge cursurile asociate userului (dacă există)
    await prisma.course.deleteMany({ where: { instructorId: id } });

    // Șterge userul
    const deletedUser = await prisma.user.delete({ where: { id } });

    // Log acțiunea utilizatorului
    await logUserAction({
      userId: user?.id || null,
      actionType: "DELETE_USER",
      actionDetails: `Deleted user with id: ${id}`,
      ipAddress: ip,
      userAgent,
    });

    return deletedUser as unknown as UserTypeWithoutPass;
  } catch (error: any) {
    await logAppError(error, url);

    await logHttpError(
      500,
      "DELETE",
      url,
      ip,
      error instanceof Error ? error.message : "Unknown server error",
      userAgent,
    );

    throw error instanceof Error ? error : new Error("Failed to delete user");
  }
}
