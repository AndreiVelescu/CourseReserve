// hooks/api/user/useGetUserActivity.ts
import { useQuery } from "@tanstack/react-query";
import { getUserActivity } from "@/lib/server/actions/getUserGroups";

export function useGetUserActivity(enabled: boolean = true) {
  return useQuery({
    queryKey: ["user-activity"],
    queryFn: async () => {
      console.log("🟡 Hook: Calling getUserActivity...");
      try {
        const result = await getUserActivity();
        console.log("✅ Hook: getUserActivity returned:", result);
        return result;
      } catch (error) {
        console.error("❌ Hook: getUserActivity error:", error);
        throw error;
      }
    },
    enabled,
    retry: 1,
    staleTime: 0,
  });
}
