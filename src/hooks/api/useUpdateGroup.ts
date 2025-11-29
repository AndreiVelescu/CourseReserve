import { createMutation } from "react-query-kit";
import { updateGroup } from "@/lib/server/actions/updateGroup";

interface UpdateGroupInput {
  groupId: number;
  name?: string;
  description?: string;
  maxMembers?: number;
  status?: "ACTIVE" | "ARCHIVED" | "CANCELLED";
}

export const useUpdateGroup = createMutation({
  mutationKey: ["updateGroup"],
  mutationFn: async (input: UpdateGroupInput) => updateGroup(input),
});
