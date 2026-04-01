const buckets = new Map();

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
};

const createRateLimiter = ({ windowMs, max, keyGenerator }) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = keyGenerator(req);
    const current = buckets.get(key);

    if (!current || current.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      const retryAfterSeconds = Math.ceil((current.expiresAt - now) / 1000);
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        message: "Too many requests. Please wait and try again.",
      });
    }

    current.count += 1;
    return next();
  };
};

const agentRateLimit = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  keyGenerator: (req) => {
    const userId = req.user?._id?.toString?.() || "anonymous";
    return `${userId}:${getClientIp(req)}`;
  },
});

module.exports = { agentRateLimit };
