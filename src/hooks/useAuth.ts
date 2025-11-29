import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
// import { deleteCookie } from "cookies-next";

import { logOut } from "@/utils/auth";
// import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/auth";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = useCallback(async () => {
    await logOut().then(() => {
      // push to home page or any other page
      router.push("/");
    });
    queryClient.removeQueries();
    // deleteCookie(ACCESS_TOKEN_KEY);
    // deleteCookie(REFRESH_TOKEN_KEY);
  }, [queryClient, router]);

  return { logout };
};
