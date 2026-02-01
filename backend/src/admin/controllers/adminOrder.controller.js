const Order = require("../../models/Order.model");

/**
 * GET ALL ORDERS (ADMIN DASHBOARD)
 * Filters supported:
 * - userId
 * - medicineId
 * - status
 * - startDate
 * - endDate
 */
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const {
      userId,
      medicineId,
      status,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    if (userId) filter.user = userId;
    if (medicineId) filter.medicine = medicineId;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate(
        "medicine",
        "name brand price requiresPrescription"
      )
      .populate("prescription", "status")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin fetch orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

/**
 * GET SINGLE ORDER (ADMIN)
 */
exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate(
        "medicine",
        "name brand price requiresPrescription"
      )
      .populate("prescription", "status");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Admin fetch order error:", error);
    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};

/**
 * UPDATE ORDER STATUS (ADMIN ACTION)
 * Allowed transitions:
 * - CONFIRMED → FULFILLED
 * - ANY → REJECTED
 */
exports.updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "CONFIRMED",
      "FULFILLED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status update",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // 🚫 Prevent fulfilling blocked orders
    if (
      order.status === "WAITING_PRESCRIPTION" &&
      status === "FULFILLED"
    ) {
      return res.status(400).json({
        message:
          "Cannot fulfill order waiting for prescription",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Admin update order error:", error);
    res.status(500).json({
      message: "Failed to update order",
    });
  }
};
