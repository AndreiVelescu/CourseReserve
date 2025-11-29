import { prisma } from "db";

export async function logAppError(error: any, url: string) {
  try {
    await prisma.appErrorLog.create({
      data: {
        errorType: error.name || "UnknownError",
        message: error.message || JSON.stringify(error),
        stackTrace: error.stack || "",
        url,
      },
    });
  } catch (err) {
    console.error("Failed to log app error:", err);
  }
}
