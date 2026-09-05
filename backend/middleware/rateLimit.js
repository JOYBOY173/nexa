// A small in-memory, fixed-window rate limiter. This is a public demo, not
// an enterprise service — no Redis or external infra needed for this.
// Note: state resets if the process restarts, and it's per-instance (fine
// for a single small server, not for a multi-instance deployment).

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

const requestLog = new Map(); // ip -> [timestamps]

function pruneOldEntries(now) {
  // Periodically prevent unbounded growth of the map across many distinct IPs.
  if (requestLog.size > 5000) {
    for (const [ip, timestamps] of requestLog.entries()) {
      const recent = timestamps.filter((t) => now - t < WINDOW_MS);
      if (recent.length === 0) requestLog.delete(ip);
      else requestLog.set(ip, recent);
    }
  }
}

export function rateLimit(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();

  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  pruneOldEntries(now);

  if (timestamps.length > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: { message: "Too many requests. Please wait a moment and try again.", code: "rate_limited" },
    });
  }

  next();
}
