const express = require("express");
const router = express.Router();
const { incomingWhatsApp } = require("../controllers/whatsapp.controller");

router.post("/incoming", incomingWhatsApp);

module.exports = router;
