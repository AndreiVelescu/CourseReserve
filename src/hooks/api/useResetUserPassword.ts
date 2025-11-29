import { useMutation } from "@tanstack/react-query";
import { resetUserPassword } from "@/lib/server/actions/userManagement";

export function useResetUserPassword(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: ({
      userId,
      newPassword,
    }: {
      userId: number;
      newPassword: string;
    }) => resetUserPassword(userId, newPassword),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
