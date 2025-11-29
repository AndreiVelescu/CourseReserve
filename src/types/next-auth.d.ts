import { UserRole } from "@prisma/client";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id?: number;
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      email: string;
      role: UserRole;
    };
  }

  interface Session {
    id: number;
    email: string;
    role: UserRole;
    accessToken: string;
    refreshToken: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string | null;
    refreshToken: string | null;
    accessTokenExpires: number | null;
    email?: string | null;
    role?: UserRole | null;
  }
}
