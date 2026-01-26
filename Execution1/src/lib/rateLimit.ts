// Rate limiting utility
// Implements a sliding window rate limiter with in-memory storage

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.startCleanup();
  }

  /**
   * Check if a request from the given IP is allowed
   * @param ip - IP address to check
   * @returns Object with allowed status and remaining request count
   */
  checkRateLimit(ip: string): RateLimitResult {
    const now = Date.now();
    const entry = this.store.get(ip);

    // No previous requests or window has expired
    if (!entry || now > entry.resetTime) {
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
      };
    }

    // Within the rate limit window
    if (entry.count < this.maxRequests) {
      entry.count++;
      return {
        allowed: true,
        remaining: this.maxRequests - entry.count,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
    };
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [ip, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(ip);
        }
      }
    }, this.windowMs);
  }

  /**
   * Stop cleanup interval (useful for testing)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  reset(): void {
    this.store.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter(5, 60000);

// Export class for testing
export { RateLimiter };
