export const rateLimitConfigs = {
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minut
  },

  admin: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minut
  },

  api: {
    maxRequests: 10,
    windowMs: 10 * 1000, // 10 secunde
  },

  strict: {
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minut
  },

  public: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000, // 1 oră
  },
} as const;

export type RateLimitType = keyof typeof rateLimitConfigs;
