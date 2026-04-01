const jwt = require("jsonwebtoken");

const TOKEN_TTL = process.env.JWT_EXPIRES_IN || "7d";

const getSecret = () => process.env.JWT_SECRET || process.env.SESSION_SECRET || "agentic-ai-pharmacy";

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    getSecret(),
    { expiresIn: TOKEN_TTL }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
};

module.exports = { signToken, verifyToken, getBearerToken };
