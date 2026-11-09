import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = {
  allowed: boolean;
  configured: boolean;
  retryAfterSeconds: number;
};
type MemoryEntry = { count: number; resetAt: number };

const memoryStore = new Map<string, MemoryEntry>();
let distributedLimiter: Ratelimit | null = null;

function getDistributedLimiter(): Ratelimit | null {
  const hasRedisConfig = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
  if (!hasRedisConfig) return null;

  distributedLimiter ??= new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(4, "10 m"),
    analytics: false,
    enableTelemetry: false,
    prefix: "bytemint:contact",
  });

  return distributedLimiter;
}

function hashIdentifier(identifier: string): string | null {
  const secret = process.env.RATE_LIMIT_HASH_SECRET;
  if (!secret || secret.length < 32) return null;
  return createHmac("sha256", secret).update(identifier).digest("hex");
}

export async function checkContactRateLimit(
  identifier: string,
): Promise<LimitResult> {
  if (process.env.NODE_ENV !== "production") {
    const now = Date.now();
    const current = memoryStore.get(identifier);

    for (const [key, entry] of memoryStore) {
      if (entry.resetAt <= now) memoryStore.delete(key);
    }

    if (!current || current.resetAt <= now) {
      memoryStore.set(identifier, { count: 1, resetAt: now + 10 * 60 * 1000 });
      return { allowed: true, configured: true, retryAfterSeconds: 0 };
    }

    if (current.count >= 4) {
      return {
        allowed: false,
        configured: true,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((current.resetAt - now) / 1000),
        ),
      };
    }

    current.count += 1;
    return { allowed: true, configured: true, retryAfterSeconds: 0 };
  }

  const limiter = getDistributedLimiter();
  const hashedIdentifier = hashIdentifier(identifier);
  if (!limiter || !hashedIdentifier) {
    return { allowed: false, configured: false, retryAfterSeconds: 0 };
  }

  const result = await limiter.limit(hashedIdentifier);
  return {
    allowed: result.success,
    configured: true,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000),
    ),
  };
}

export function getRequestIdentifier(request: Request): string | null {
  // Prefer the single-client header set by the trusted hosting proxy.
  // Configure the reverse proxy to overwrite this header and never expose the
  // application server directly to the public internet.
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const candidate = realIp || forwardedFor;

  if (!candidate) {
    return process.env.NODE_ENV === "production" ? null : "local-development";
  }

  const ipVersion = isIP(candidate);
  if (ipVersion === 0) {
    return process.env.NODE_ENV === "production" ? null : "local-development";
  }

  if (ipVersion === 6) {
    try {
      return new URL(`http://[${candidate}]/`).hostname
        .slice(1, -1)
        .toLowerCase();
    } catch {
      return process.env.NODE_ENV === "production" ? null : "local-development";
    }
  }

  return candidate;
}
