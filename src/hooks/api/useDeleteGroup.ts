import { createMutation } from "react-query-kit";
import { deleteGroup } from "@/lib/server/actions/deleteGroup";

export const useDeleteGroup = createMutation({
  mutationKey: ["deleteGroup"],
  mutationFn: async (groupId: number) => deleteGroup(groupId),
});
