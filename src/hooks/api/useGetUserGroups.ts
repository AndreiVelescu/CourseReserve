// hooks/api/user/useGetUserGroups.ts
import { useQuery } from "@tanstack/react-query";
import { getUserGroups } from "@/lib/server/actions/getUserGroups";

export function useGetUserGroups(enabled: boolean = true) {
  return useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      try {
        const result = await getUserGroups();
        return result;
      } catch (error) {
        console.error("❌ Hook: getUserGroups error:", error);
        throw error;
      }
    },
    enabled,
    retry: 1,
    staleTime: 0,
  });
}
