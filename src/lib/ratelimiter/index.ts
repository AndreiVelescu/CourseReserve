// lib/ratelimit/index.ts
export { inMemoryRateLimiter } from "./inMemoryRatelimit";
export { rateLimitConfigs, type RateLimitType } from "./configs";
export {
  getRateLimitMessage,
  RateLimitError,
  formatRateLimitInfo,
} from "./utils";

import { inMemoryRateLimiter } from "./inMemoryRatelimit";
import { rateLimitConfigs, type RateLimitType } from "./configs";
import { RateLimitError } from "./utils";

export async function applyRateLimit(
  identifier: string,
  type: RateLimitType = "api",
) {
  const config = rateLimitConfigs[type];
  const result = await inMemoryRateLimiter.limit(identifier, config);

  if (!result.success) {
    throw new RateLimitError(result.reset, result.remaining, result.limit);
  }

  return result;
}
