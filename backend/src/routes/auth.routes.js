const express = require("express");
const passport = require("passport");

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
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.user });
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
