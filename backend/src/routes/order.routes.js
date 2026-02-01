const express = require("express");
const router = express.Router();
const {
  createOrderController,
  getMyOrdersController,
} = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");

// Create order (used by AI + frontend)
router.post("/create", createOrderController);

// Get logged-in user's orders
router.get("/my", auth, getMyOrdersController);

module.exports = router;
