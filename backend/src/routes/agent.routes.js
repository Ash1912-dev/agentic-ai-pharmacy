const express = require("express");
const { agentMessage } = require("../controllers/agent.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// Auth-only — no rate limiting or AI guard
router.post("/message", auth, agentMessage);

module.exports = router;
