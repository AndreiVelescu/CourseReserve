"use client";
import { createMutation } from "react-query-kit";
import { updateUsername } from "@/lib/server/actions/updateUsername";

export const useUpdateUsername = createMutation({
  mutationKey: ["updateUsername"],
  mutationFn: (newUsername: string) => updateUsername(newUsername),
});
