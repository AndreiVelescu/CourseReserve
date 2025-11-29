import { useMutation } from "@tanstack/react-query";
import { onCreateUser } from "@/lib/server/actions/onCreateUser";
import {
  CreateUserInputType,
  CreateUserOutputType,
} from "@/lib/server/actions/types";

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: async (input: CreateUserInputType) => {
      try {
        return await onCreateUser(input);
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Failed to create user");
      }
    },
  });
}
