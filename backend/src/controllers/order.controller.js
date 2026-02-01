const { createOrder } = require("../services/order.service");
const Order = require("../models/Order.model");

// ==========================
// CREATE ORDER
// ==========================
const createOrderController = async (req, res) => {
  try {
    const result = await createOrder({
      ...req.body,
      userId: req.user._id, // trust backend auth only
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ==========================
// GET USER ORDERS
// ==========================
const getMyOrdersController = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("medicine")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

module.exports = {
  createOrderController,
  getMyOrdersController,
};
