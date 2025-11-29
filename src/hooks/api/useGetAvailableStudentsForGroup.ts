// hooks/api/useGetAvailableStudentsForGroup.ts
import { useQuery } from "@tanstack/react-query";
import { getAvailableStudentsForGroup } from "@/lib/server/actions/getAvailableStudentsForGroup";

interface UseGetAvailableStudentsForGroupProps {
  variables: {
    courseId: number;
    groupId?: number; // ✅ Adăugat groupId opțional
  };
  enabled?: boolean;
}

export function useGetAvailableStudentsForGroup({
  variables,
  enabled = true,
}: UseGetAvailableStudentsForGroupProps) {
  return useQuery({
    queryKey: [
      "groups",
      "available-students",
      variables.courseId,
      variables.groupId,
    ],
    queryFn: () =>
      getAvailableStudentsForGroup(variables.courseId, variables.groupId),
    enabled,
  });
}
