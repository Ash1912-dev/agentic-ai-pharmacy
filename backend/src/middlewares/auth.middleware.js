const User = require("../models/User.model");
const { verifyToken, getBearerToken } = require("../utils/token");

// Passport-based authentication middleware
const auth = async (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

};

module.exports = auth;
