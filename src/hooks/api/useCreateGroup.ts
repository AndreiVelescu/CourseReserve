// hooks/api/groups/useCreateGroup.ts
import { createMutation } from "react-query-kit";
import { createGroup } from "@/lib/server/actions/createGroup";

interface CreateGroupInput {
  name: string;
  description?: string;
  courseId: number;
  maxMembers?: number;
}

export const useCreateGroup = createMutation({
  mutationKey: ["createGroup"],
  mutationFn: async (input: CreateGroupInput) => createGroup(input),
});
