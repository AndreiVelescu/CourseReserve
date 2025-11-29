import { useMutation } from "@tanstack/react-query";

import { CreateReservationInputType } from "@/lib/server/actions/types";

import { createReservation } from "@/lib/server/actions/createReservation";

export function useCreateReservationMutation() {
  return useMutation({
    mutationFn: async (input: CreateReservationInputType) => {
      try {
        return await createReservation(input);
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Failed to create reservation");
      }
    },
  });
}
