const Inventory = require("../models/Inventory.model");
const Medicine = require("../models/Medicine.model");
const Order = require("../models/Order.model");
const Prescription = require("../models/Prescription.model");
const User = require("../models/User.model");
const UserMedicineCourse = require("../models/UserMedicineCourse.model");
const twilioClient = require("../config/twilio");

/**
 * INTERNAL: Fulfill order (stock + WhatsApp + course)
 * Used by BOTH chat flow & admin verification
 */
const fulfillOrder = async (order) => {
  // 🔒 Idempotency guard
  if (order.isFulfilled) return;

  const inventory = await Inventory.findOne({ medicine: order.medicine });
  if (!inventory || inventory.stock < order.quantity) {
    throw new Error("Insufficient stock during fulfillment");
  }

  // 1️⃣ Reduce stock
  inventory.stock -= order.quantity;
  await inventory.save();

  // 2️⃣ Create medicine course
  await UserMedicineCourse.create({
    user: order.user,
    medicine: order.medicine,
    totalQuantity: order.quantity,
    remainingQuantity: order.quantity,
  });

  // 3️⃣ Send WhatsApp
  const user = await User.findById(order.user);
  const medicine = await Medicine.findById(order.medicine);

  if (user?.phone) {
    const to = `whatsapp:+91${user.phone.replace(/\D/g, "")}`;

    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to,
      body: `✅ Order Confirmed

💊 Medicine: ${medicine.name}
📦 Quantity: ${order.quantity}
🆔 Order ID: ${order._id}

Thank you for using Agentic AI Pharmacy 💙`,
    });
  }

  // 4️⃣ Mark fulfilled (NEW but non-breaking)
  order.isFulfilled = true;
  await order.save();
};

/**
 * CREATE ORDER (CHAT FLOW)
 */
const createOrder = async ({ userId, medicineId, quantity }) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) throw new Error("Medicine not found");

  const inventory = await Inventory.findOne({ medicine: medicineId });
  if (!inventory) throw new Error("Inventory not found");

  if (inventory.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  // 🔐 RX CHECK
  if (medicine.requiresPrescription) {
    const prescription = await Prescription.findOne({
      user: userId,
      status: "VERIFIED",
    });

    if (!prescription) {
      const order = await Order.create({
        user: userId,
        medicine: medicineId,
        quantity,
        status: "WAITING_PRESCRIPTION",
        isFulfilled: false,
      });

      return {
        message: "Prescription required",
        order,
      };
    }
  }

  // ✅ DIRECT CONFIRM
  const order = await Order.create({
    user: userId,
    medicine: medicineId,
    quantity,
    status: "CONFIRMED",
    isFulfilled: false,
  });

  await fulfillOrder(order);

  return {
    message: "Order confirmed successfully",
    order,
  };
};

module.exports = {
  createOrder,
  fulfillOrder, // 👈 exposed ONLY for admin usage
};
