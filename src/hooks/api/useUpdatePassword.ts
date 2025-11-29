"use client";
import { updatePassword } from "@/lib/server/actions/updatePassword";
import { createMutation } from "react-query-kit";

export const useUpdatePassword = createMutation({
  mutationKey: ["updatePassword"],
  mutationFn: ({
    newPassword,
    oldPassword,
  }: {
    newPassword: string;
    oldPassword: string;
  }) => updatePassword(newPassword, oldPassword),
});
