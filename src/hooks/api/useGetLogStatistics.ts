import { useQuery } from "@tanstack/react-query";
import { getLogStatistics } from "@/lib/server/actions/getLogs";

export function useGetLogStatistics(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin", "log-statistics"],
    queryFn: () => getLogStatistics(),
    enabled,
    refetchInterval: 60000,
  });
}
