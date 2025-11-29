interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup entries vechi la fiecare 5 minute
    this.startCleanup();
  }

  private startCleanup() {
    this.cleanupInterval = setInterval(
      () => {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
          if (entry.resetTime < now) {
            this.store.delete(key);
          }
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes
  }

  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  async limit(
    identifier: string,
    config: { maxRequests: number; windowMs: number },
  ): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // Dacă nu există entry sau a expirat, creează unul nou
    if (!entry || entry.resetTime < now) {
      const resetTime = now + config.windowMs;
      this.store.set(identifier, {
        count: 1,
        resetTime,
      });

      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: resetTime,
      };
    }

    // Check dacă am depășit limita
    if (entry.count >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: entry.resetTime,
      };
    }

    // Incrementează counter-ul
    entry.count++;

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      reset: entry.resetTime,
    };
  }

  // Pentru testing/debugging
  reset(identifier?: string) {
    if (identifier) {
      this.store.delete(identifier);
    } else {
      this.store.clear();
    }
  }

  getStats() {
    return {
      totalKeys: this.store.size,
      entries: Array.from(this.store.entries()).map(([key, value]) => ({
        identifier: key,
        count: value.count,
        resetTime: new Date(value.resetTime).toISOString(),
      })),
    };
  }
}

// Singleton instance
export const inMemoryRateLimiter = new InMemoryRateLimiter();
