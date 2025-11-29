import { prisma } from "db";

export async function logHttpError(
  statusCode: number,
  method: string,
  url: string,
  ipAddress: string = "",
  message: string = "",
  userAgent: string = "",
) {
  try {
    await prisma.httpErrorLog.create({
      data: {
        statusCode,
        method,
        url,
        ipAddress,
        message,
        userAgent,
      },
    });
  } catch (err) {
    console.error("Failed to log HTTP error:", err);
  }
}
