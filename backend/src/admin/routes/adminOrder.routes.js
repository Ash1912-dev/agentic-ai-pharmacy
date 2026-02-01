const express = require("express");
const router = express.Router();

const {
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
} = require("../controllers/adminOrder.controller");

const {
  adminAuth,
} = require("../middlewares/adminAuth.middleware");

// 🔐 Protect all admin order routes
router.use(adminAuth);

// 📦 Get all orders
router.get("/", getAllOrdersAdmin);

// 📦 Get single order
router.get("/:id", getOrderByIdAdmin);

// 🔄 Update order status
router.patch("/:id/status", updateOrderStatusAdmin);

module.exports = router;
