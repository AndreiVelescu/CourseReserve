import { useMutation } from "@tanstack/react-query";
import { removeMemberFromGroup } from "@/lib/server/actions/removeMemberFromGroup";

interface RemoveMemberFromGroupInput {
  groupId: number;
  userId: number;
  restoreReservation?: boolean;
}

interface UseRemoveMemberFromGroupOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useRemoveMemberFromGroup(
  options?: UseRemoveMemberFromGroupOptions,
) {
  return useMutation({
    mutationFn: (input: RemoveMemberFromGroupInput) =>
      removeMemberFromGroup(input),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
