// lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "db";

/**
 * Verifică dacă utilizatorul curent este autorizat să gestioneze grupuri
 * @returns User object dacă e autorizat, throw error dacă nu
 */
export async function requireInstructorOrAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Nu ești autentificat!");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Utilizatorul nu a fost găsit!");
  }

  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    throw new Error("Nu ai permisiunea de a efectua această acțiune!");
  }

  return user;
}

export async function requireCourseInstructor(courseId: number) {
  const user = await requireInstructorOrAdmin();

  if (user.role === "ADMIN") {
    return user;
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });

  if (!course) {
    throw new Error("Cursul nu a fost găsit!");
  }

  if (course.instructorId !== user.id) {
    throw new Error("Nu ești instructorul acestui curs!");
  }

  return user;
}
