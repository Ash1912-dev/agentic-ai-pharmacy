const dailyUsage = new Map();

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const getUtcDayKey = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
};

const parseAllowedUsers = () => {
  const raw = process.env.AI_ALLOWED_USERS || "";
  return new Set(
    raw
      .split(",")
      .map((part) => normalize(part))
      .filter(Boolean)
  );
};

const isUserAllowed = (req) => {
  const allowed = parseAllowedUsers();
  if (allowed.size === 0) {
    return true;
  }

  const userId = normalize(req.user?._id);
  const email = normalize(req.user?.email);
  const phone = normalize(req.user?.phone);

  return allowed.has(userId) || allowed.has(email) || allowed.has(phone);
};

const enforceDailyLimit = (req, res, next) => {
  const maxPerDay = Number(process.env.AI_DAILY_LIMIT || 40);
  const userId = normalize(req.user?._id);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dayKey = getUtcDayKey();
  const usageKey = `${userId}:${dayKey}`;
  const current = dailyUsage.get(usageKey) || 0;

  if (current >= maxPerDay) {
    return res.status(429).json({
      message: "Daily AI limit reached for this account. Try again tomorrow.",
    });
  }

  dailyUsage.set(usageKey, current + 1);
  return next();
};

const aiGuard = (req, res, next) => {
  const enabled = (process.env.AI_ENABLED || "true").toLowerCase() === "true";

  if (!enabled) {
    return res.status(503).json({
      message: "AI feature is temporarily disabled.",
    });
  }

  if (!isUserAllowed(req)) {
    return res.status(403).json({
      message: "AI access is restricted for this deployment.",
    });
  }

  return enforceDailyLimit(req, res, next);
};

module.exports = { aiGuard };
