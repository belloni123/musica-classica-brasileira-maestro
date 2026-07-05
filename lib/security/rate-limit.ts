import "server-only";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  __mbcRateLimitStore?: Map<string, RateLimitBucket>;
};

const store = globalRateLimit.__mbcRateLimitStore ?? new Map<string, RateLimitBucket>();
globalRateLimit.__mbcRateLimitStore = store;

export function consumeRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const current = store.get(options.key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(options.key, { count: 1, resetAt });
    cleanupExpiredBuckets(now);

    return {
      allowed: true,
      remaining: Math.max(options.limit - 1, 0),
      retryAfterSeconds: 0,
      resetAt,
    };
  }

  current.count += 1;
  store.set(options.key, current);

  const retryAfterSeconds = Math.max(Math.ceil((current.resetAt - now) / 1000), 1);
  const remaining = Math.max(options.limit - current.count, 0);

  return {
    allowed: current.count <= options.limit,
    remaining,
    retryAfterSeconds,
    resetAt: current.resetAt,
  };
}

export function isAnyRateLimitBlocked(results: RateLimitResult[]) {
  return results.some((result) => !result.allowed);
}

function cleanupExpiredBuckets(now: number) {
  if (store.size < 5000) {
    return;
  }

  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  }
}

