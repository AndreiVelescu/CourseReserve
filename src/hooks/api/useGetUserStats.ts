import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/lib/server/actions/getUserGroups";

export function useGetUserStats(enabled: boolean = true) {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
