import { useMutation } from "@tanstack/react-query";
import { deleteReservation } from "@/lib/server/actions/deleteReservation";

interface UseDeleteReservationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteReservation(options?: UseDeleteReservationOptions) {
  return useMutation({
    mutationKey: ["deleteReservation"],
    mutationFn: (reservationId: number) => deleteReservation(reservationId),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
