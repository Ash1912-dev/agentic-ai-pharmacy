const express = require("express");
const passport = require("passport");
const User = require("../models/User.model");
const { verifyToken, getBearerToken } = require("../utils/token");

const router = express.Router();

/**
 * START GOOGLE LOGIN
 * This is where the `scope` MUST be defined
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["openid", "profile"], // ✅ REQUIRED
  })
);

/**
 * GOOGLE CALLBACK
 * This part was already correct in your code
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    // Successful login → redirect to frontend
    res.redirect("http://localhost:5173/");
  }
);

/**
 * GET CURRENT LOGGED-IN USER
 */
router.get("/me", (req, res) => {
  if (req.user) {
    return res.json({ user: req.user });
  }

  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = verifyToken(token);
    User.findById(payload.sub)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        return res.json({ user });
      })
      .catch(() => res.status(401).json({ message: "Not authenticated" }));
  } catch {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

/**
 * LOGOUT
 */
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
