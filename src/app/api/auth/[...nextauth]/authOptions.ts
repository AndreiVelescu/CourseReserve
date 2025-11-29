import NextAuth, { NextAuthOptions } from "next-auth";
// eslint-disable-next-line import/no-named-as-default
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";

import { refreshAccessToken } from "@/lib/server/actions/onRefreshToken";
import { onUserLogin } from "@/lib/server/actions/onUserLogin";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        from: { label: "From", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.username && credentials?.password) {
          const response = await onUserLogin(
            credentials.username,
            credentials.password,
            Boolean(credentials.from),
          );

          return response;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, add user data to the token
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken || null,
          refreshToken: user.refreshToken || null,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
          email: user.user?.email || null,
          role: user.user?.role,
        };
      }

      // Check if the current access token is expired
      if (Date.now() > (token.accessTokenExpires || 0)) {
        const refreshedTokens = await refreshAccessToken(token);

        // If token refresh fails, clear the token but keep required fields
        if (!refreshedTokens) {
          return {
            ...token,
            accessToken: null,
            refreshToken: null,
            accessTokenExpires: null,
          };
        }

        // Merge the refreshed tokens with the existing token
        return {
          ...token,
          ...refreshedTokens,
        };
      }

      // If the token is still valid, return it unchanged
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken && token.email && session.user) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.email = token.email;
        session.role = token.role!;
      }
      return session;
    },
  },
};

interface RouteHandlerContext {
  params: { nextauth: string[] };
}

// NextAuth handler using the authOptions configuration
export const auth = (req: NextRequest, context: RouteHandlerContext) => {
  return NextAuth(req, context, authOptions);
};
