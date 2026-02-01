const express = require("express");
const { agentMessage } = require("../controllers/agent.controller");

const router = express.Router();

router.post("/message", agentMessage);

module.exports = router;
