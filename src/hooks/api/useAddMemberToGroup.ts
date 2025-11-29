// hooks/api/useAddMemberToGroup.ts
import { useMutation } from "@tanstack/react-query";
import { addMemberToGroup } from "@/lib/server/actions/addMemberToGroup";

interface AddMemberToGroupInput {
  groupId: number;
  userId: number;
}

interface UseAddMemberToGroupOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAddMemberToGroup(options?: UseAddMemberToGroupOptions) {
  return useMutation({
    mutationFn: (input: AddMemberToGroupInput) => addMemberToGroup(input),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
