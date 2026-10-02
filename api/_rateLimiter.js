/**
 * Best-effort serverless in-memory sliding-window rate limiter
 * Protects zero-budget free tier against rapid automated scraping/abuse.
 */

const ipRequestMap = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

export function checkRateLimit(req) {
  // Extract client IP address from Vercel / proxy headers
  const forwarded = req.headers?.['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || '127.0.0.1';

  const now = Date.now();
  const userTimestamps = ipRequestMap.get(ip) || [];

  // Filter timestamps within the current window
  const activeTimestamps = userTimestamps.filter(ts => now - ts < WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      ip,
      remaining: 0,
      retryAfterSec: Math.ceil((activeTimestamps[0] + WINDOW_MS - now) / 1000)
    };
  }

  activeTimestamps.push(now);
  ipRequestMap.set(ip, activeTimestamps);

  // Periodically cleanup stale entries
  if (ipRequestMap.size > 1000) {
    for (const [key, timestamps] of ipRequestMap.entries()) {
      if (timestamps.every(t => now - t > WINDOW_MS)) {
        ipRequestMap.delete(key);
      }
    }
  }

  return {
    allowed: true,
    ip,
    remaining: MAX_REQUESTS_PER_WINDOW - activeTimestamps.length
  };
}
