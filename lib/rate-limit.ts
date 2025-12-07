interface RateLimitStore {
  increment(key: string): number;
  reset(key: string): void;
}

class MemoryStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();
  private windowMs: number;

  constructor(windowMs: number = 60 * 1000) {
    this.windowMs = windowMs;
  }

  increment(key: string): number {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return 1;
    }

    entry.count++;
    return entry.count;
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  store?: RateLimitStore;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req: Request) => {
    return req.headers.get('x-forwarded-for') || 'unknown';
  },
};

export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const store = finalConfig.store || new MemoryStore(finalConfig.windowMs);

  return {
    check: (req: Request): { allowed: boolean; remaining: number } => {
      const key = finalConfig.keyGenerator!(req);
      const count = store.increment(key);
      const allowed = count <= finalConfig.maxRequests;
      const remaining = Math.max(0, finalConfig.maxRequests - count);

      return { allowed, remaining };
    },
    reset: (req: Request) => {
      const key = finalConfig.keyGenerator!(req);
      store.reset(key);
    },
  };
}

export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  maxRequests: 50,
});
