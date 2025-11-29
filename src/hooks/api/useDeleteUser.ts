import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/lib/server/actions/userManagement";

export function useDeleteUser(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
