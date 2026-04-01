const express = require("express");
const { agentMessage } = require("../controllers/agent.controller");
const auth = require("../middlewares/auth.middleware");
const { agentRateLimit } = require("../middlewares/rateLimit.middleware");
const { aiGuard } = require("../middlewares/aiGuard.middleware");

const router = express.Router();

router.post("/message", auth, aiGuard, agentRateLimit, agentMessage);

module.exports = router;
