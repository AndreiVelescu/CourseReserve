"use client";
import { createQuery } from "react-query-kit";
import { getReservationById } from "@/lib/server/actions/getReservationById";

type ReservationWithCourse = {
  id: number;
  userId: number;
  courseId: number;
  reservedAt: Date;

  course: {
    id: number;
    title: string;
    description: string;
    category: string;
    durationMinutes: number;
    startDate: string;
  };
};

export const useGetReservationById = createQuery({
  queryKey: ["getReservationById"],
  fetcher: async ({ id }: { id: string }): Promise<ReservationWithCourse> => {
    return await getReservationById(id);
  },
});
