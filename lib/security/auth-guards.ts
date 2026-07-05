import "server-only";

import { isAnyRateLimitBlocked, consumeRateLimit } from "@/lib/security/rate-limit";
import { getRequestIp, hashForSecurityLog } from "@/lib/security/request";

const MINIMUM_AUTH_RESPONSE_MS = 450;

type AuthRateLimitScope = "sign-in" | "sign-up" | "reset-password";

const rateLimitConfig = {
  "sign-in": {
    ipLimit: 25,
    identityLimit: 5,
    windowMs: 15 * 60 * 1000,
  },
  "sign-up": {
    ipLimit: 10,
    identityLimit: 3,
    windowMs: 60 * 60 * 1000,
  },
  "reset-password": {
    ipLimit: 10,
    identityLimit: 3,
    windowMs: 60 * 60 * 1000,
  },
} satisfies Record<AuthRateLimitScope, { ipLimit: number; identityLimit: number; windowMs: number }>;

export async function enforceAuthRateLimit(scope: AuthRateLimitScope, identity: string) {
  const ip = await getRequestIp();
  const config = rateLimitConfig[scope];
  const ipKey = hashForSecurityLog(`${scope}:ip:${ip}`);
  const identityKey = hashForSecurityLog(`${scope}:identity:${identity}`);

  const results = [
    consumeRateLimit({
      key: ipKey,
      limit: config.ipLimit,
      windowMs: config.windowMs,
    }),
    consumeRateLimit({
      key: identityKey,
      limit: config.identityLimit,
      windowMs: config.windowMs,
    }),
  ];

  return {
    allowed: !isAnyRateLimitBlocked(results),
    ip,
    retryAfterSeconds: Math.max(...results.map((result) => result.retryAfterSeconds)),
  };
}

export async function keepMinimumAuthResponseTime(startedAt: number) {
  const elapsed = Date.now() - startedAt;

  if (elapsed < MINIMUM_AUTH_RESPONSE_MS) {
    await new Promise((resolve) => setTimeout(resolve, MINIMUM_AUTH_RESPONSE_MS - elapsed));
  }
}

