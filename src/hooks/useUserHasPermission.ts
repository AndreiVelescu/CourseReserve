import { UserRole } from "@prisma/client";

import { useGetCurrentUser } from "./api/useGetCurrentUser";
import { useIsLoggedIn } from "./useIsLoggedIn";

export const useUserHasPermission = (permission: UserRole) => {
  const { isLogged, isAuthLoading } = useIsLoggedIn();

  const { data: currentUser, isPending } = useGetCurrentUser({
    enabled: isLogged && !isAuthLoading,
  });

  if (!currentUser) {
    return false;
  }
  if (isPending) {
    return false;
  }

  return currentUser.role === permission;
};
