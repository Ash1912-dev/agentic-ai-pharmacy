const Prescription = require("../../models/Prescription.model");
const Order = require("../../models/Order.model");
const { fulfillOrder } = require("../../services/order.service");

/**
 * GET ALL PRESCRIPTIONS
 */
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error("Fetch prescriptions error:", error);
    res.status(500).json({
      message: "Failed to fetch prescriptions",
    });
  }
};

/**
 * GET SINGLE PRESCRIPTION
 */
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("user", "name email phone");

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.json(prescription);
  } catch (error) {
    console.error("Fetch prescription error:", error);
    res.status(500).json({
      message: "Failed to fetch prescription",
    });
  }
};

/**
 * VERIFY PRESCRIPTION
 * 🔥 Unlock + Fulfill linked orders
 */
exports.approvePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    if (prescription.status === "VERIFIED") {
      return res.status(400).json({
        message: "Prescription already verified",
      });
    }

    // 1️⃣ Verify prescription
    prescription.status = "VERIFIED";
    await prescription.save();

    // 2️⃣ Find linked WAITING orders
    const orders = await Order.find({
      prescription: prescription._id,
      status: "WAITING_PRESCRIPTION",
    });

    // 3️⃣ Confirm + fulfill each order
    for (const order of orders) {
      order.status = "CONFIRMED";
      await order.save();

      // 🔥 This was missing earlier
      await fulfillOrder(order);
    }

    console.log(
      "✅ Orders unlocked & fulfilled:",
      orders.length
    );

    res.json({
      message: "Prescription verified & orders fulfilled",
      ordersFulfilled: orders.length,
    });

  } catch (error) {
    console.error("Approve prescription error:", error);
    res.status(500).json({
      message: "Failed to approve prescription",
    });
  }
};

/**
 * REJECT PRESCRIPTION
 */
exports.rejectPrescription = async (req, res) => {
  try {
    const { reason } = req.body;

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    prescription.status = "REJECTED";
    prescription.rejectionReason =
      reason || "Invalid prescription";

    await prescription.save();

    res.json({
      message: "Prescription rejected",
    });
  } catch (error) {
    console.error("Reject prescription error:", error);
    res.status(500).json({
      message: "Failed to reject prescription",
    });
  }
};
