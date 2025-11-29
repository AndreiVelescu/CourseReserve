import { useMutation } from "@tanstack/react-query";
import { exportUsers } from "@/lib/server/actions/userManagement";

export function useExportUsers() {
  return useMutation({
    mutationFn: (format: "csv" | "json") => exportUsers(format),
  });
}
