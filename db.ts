import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient<Prisma.PrismaClientOptions, "query">;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });

const sqlLoggingParam = Boolean(
  process.env.ENABLE_SQL_LOGGING && process.env.ENABLE_SQL_LOGGING === "true",
);

if (sqlLoggingParam) {
  prisma.$on("query", (e) => {
    console.log("Query: " + e.query);
    console.log("Params: " + e.params);
    console.log("Duration: " + e.duration + "ms");
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
