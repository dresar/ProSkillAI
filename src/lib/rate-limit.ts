export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

const rateLimitStore = new Map<string, number[]>();
let lastPrunedAt = Date.now();

function pruneExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastPrunedAt < 30000 && rateLimitStore.size < 500) {
    return;
  }
  lastPrunedAt = now;
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter((t) => now - t < windowMs);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, valid);
    }
  }
}

export function checkRateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60000
): RateLimitResult {
  pruneExpired(windowMs);

  const now = Date.now();
  const timestamps = (rateLimitStore.get(key) || []).filter(
    (t) => now - t < windowMs
  );

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  timestamps.push(now);
  rateLimitStore.set(key, timestamps);

  return {
    allowed: true,
    remaining: Math.max(0, limit - timestamps.length),
    resetMs: windowMs,
  };
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}

export function getClientIp(req: Request): string {
  const headers = req.headers;
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp && cfConnectingIp.trim().length > 0) {
    return cfConnectingIp.trim();
  }

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor && forwardedFor.trim().length > 0) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return "127.0.0.1";
}
