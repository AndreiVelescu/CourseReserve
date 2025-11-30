import { useMutation } from "@tanstack/react-query";
import { clearOldLogs } from "@/lib/server/actions/getLogs";

export function useClearOldLogs(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: (daysToKeep: number) => clearOldLogs(daysToKeep),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
