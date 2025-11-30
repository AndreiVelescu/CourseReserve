import { useQuery } from "@tanstack/react-query";
import { getHttpErrorLogs } from "@/lib/server/actions/getLogs";

export function useGetHttpErrorLogs(
  limit: number = 100,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin", "http-error-logs", limit],
    queryFn: () => getHttpErrorLogs(limit),
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
