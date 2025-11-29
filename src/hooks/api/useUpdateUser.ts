import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/lib/server/actions/userManagement";

interface UpdateUserInput {
  userId: number;
  username?: string;
  email?: string;
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  isActive?: boolean;
}

export function useUpdateUser(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(input),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
