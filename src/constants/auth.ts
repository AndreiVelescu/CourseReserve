export const ACCESS_TOKEN_KEY = "access_token" as const;
export const REFRESH_TOKEN_KEY = "refresh_token" as const;
export const REFRESH_TOKEN_EXP = new Date(
  new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
);
