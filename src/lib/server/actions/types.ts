import { Category, Prisma, UserRole } from "@prisma/client";

export type ThrowErrorType = {
  error: string;
};

export type UserTypeWithoutPass = {
  id: number;
  email: string;
  phone: string;

  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};

export type UserTypeWithoutPassAndId = {
  email: string;
  phone: string;
  confirmed: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};

export type CreateUserInputType = {
  email: string;
  password: string;
};

export type CreateUserOutputType = {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
};

export type CreateCourseInputType = {
  title: string;
  description: string;
  category: Category;
  instructorId: number;
  startDate: Date;
  durationMinutes: number;
};

export type CreateCourseOutputType = {
  id: number;
  title: string;
  description: string;
  category: Category;
  instructorId: number;
  startDate: Date;
  durationMinutes: number;
};

export type CreateReservationInputType = {
  userId: number;
  courseId: number;
  reservedAt: Date;
};

export type CreateReservationOutputType = {
  id: number;
  userId: number;
  courseId: number;
  reservedAt: Date;
};
