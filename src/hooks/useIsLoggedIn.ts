import { useSession } from "next-auth/react";

export const useIsLoggedIn = () => {
  const session = useSession();
  const isAuthLoading = session.status === "loading";
  const isLogged = session.status === "authenticated";
  const accessToken = session.data?.accessToken;

  return {
    isAuthLoading,
    isLogged,
    accessToken,
  };
};
