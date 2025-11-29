"use server";

import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Access token secret
// const REFRESH_TOKEN_SECRET =
//   process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key"; // Refresh token secret

export async function refreshAccessToken(token: JWT): Promise<JWT | null> {
  try {
    if (token.refreshToken) {
      const decoded = jwt.verify(
        token.refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      );

      const newAccessToken = jwt.sign(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        { userId: decoded.userId },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );
      return {
        ...token,
        accessToken: newAccessToken,
        accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    return null; // If the refresh fails, return null
  }
}
