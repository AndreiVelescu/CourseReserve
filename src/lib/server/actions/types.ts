import {
  Category,
  Course,
  Prisma,
  Reservation,
  UserActionLog,
  UserRole,
} from "@prisma/client";

export type ThrowErrorType = {
  error: string;
};

export type UserTypeWithoutPass = {
  id: number;
  email: string;
  phone: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};
export type UserTypeWithoutPassForAdmin = {
  id: number;
  email: string;
  phone: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  reservations: Reservation[];
  instructorCourses: Course[];
  userActionLogs: UserActionLog[];
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
