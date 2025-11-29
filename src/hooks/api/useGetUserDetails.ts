import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "@/lib/server/actions/userManagement";

export function useGetUserDetails(
  userId: number | null,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["user-details", userId],
    queryFn: () => (userId ? getUserDetails(userId) : null),
    enabled: enabled && userId !== null,
  });
}
