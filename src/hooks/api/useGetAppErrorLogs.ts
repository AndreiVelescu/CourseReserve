import { useQuery } from "@tanstack/react-query";
import { getAppErrorLogs } from "@/lib/server/actions/getLogs";

export function useGetAppErrorLogs(
  limit: number = 100,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin", "app-error-logs", limit],
    queryFn: () => getAppErrorLogs(limit),
    enabled,
    refetchInterval: 30000,
  });
}
