import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/lib/server/actions/userManagement";

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

export function useCreateUser(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
