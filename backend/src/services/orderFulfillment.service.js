const Inventory = require("../models/Inventory.model");
const User = require("../models/User.model");
const Medicine = require("../models/Medicine.model");
const UserMedicineCourse = require("../models/UserMedicineCourse.model");
const twilioClient = require("../config/twilio");

const fulfillOrder = async (order) => {
  // 1️⃣ Reduce inventory
  const inventory = await Inventory.findOne({ medicine: order.medicine });
  if (!inventory || inventory.stock < order.quantity) {
    throw new Error("Insufficient stock during fulfillment");
  }

  inventory.stock -= order.quantity;
  await inventory.save();

  // 2️⃣ Create medicine course
  await UserMedicineCourse.create({
    user: order.user,
    medicine: order.medicine,
    totalQuantity: order.quantity,
    remainingQuantity: order.quantity,
  });

  // 3️⃣ Send WhatsApp confirmation
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

  return true;
};

module.exports = { fulfillOrder };
