// eslint-disable-next-line import/no-named-as-default
import { signOut } from "next-auth/react";

export const logOut = async () => {
  await signOut({ redirect: false });
};
