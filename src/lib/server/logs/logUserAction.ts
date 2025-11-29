import { prisma } from "db";

export async function logUserAction({
  userId = null,
  actionType,
  actionDetails = "",
  ipAddress = "",
  userAgent = "",
}: {
  userId?: number | null;
  actionType: string;
  actionDetails?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await prisma.userActionLog.create({
      data: {
        userId,
        actionType,
        actionDetails,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    console.error("Failed to log user action:", err);
  }
}
