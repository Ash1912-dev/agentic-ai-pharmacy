const express = require("express");
const router = express.Router();
const {
  checkInventory,
} = require("../controllers/inventory.controller");

router.post("/check", checkInventory);

module.exports = router;
