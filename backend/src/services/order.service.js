const Inventory = require("../models/Inventory.model");
const Medicine = require("../models/Medicine.model");
const Order = require("../models/Order.model");
const Prescription = require("../models/Prescription.model");
const User = require("../models/User.model");
const UserMedicineCourse = require("../models/UserMedicineCourse.model");
const twilioClient = require("../config/twilio");
const { formatWhatsAppNumber } = require("../utils/phone.util");
const DailyIntakeReminder = require("../models/DailyIntakeReminder.model");
const { getTimeHHMMInTimezone } = require("../utils/time");

/**
 * INTERNAL: Fulfill order (stock + WhatsApp + course)
 * Used by BOTH chat flow & admin verification
 */
const fulfillOrder = async (order) => {
    console.log(`[fulfillOrder] Called for orderId=${order._id}, isFulfilled=${order.isFulfilled}`);
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

  // 2.5️⃣ Automatically create or extend daily intake reminder
  try {
    const existingReminder = await DailyIntakeReminder.findOne({
      user: order.user,
      medicine: order.medicine,
      enabled: true
    });

    if (existingReminder) {
      const additionalDays = Math.max(1, order.quantity);
      const newEndDate = new Date(existingReminder.endDate);
      newEndDate.setDate(newEndDate.getDate() + additionalDays);
      existingReminder.endDate = newEndDate;

      // Add the current time if it's not already in the schedule to trigger immediately
      const now = new Date();
      const currentLocalTime = getTimeHHMMInTimezone(now);
      if (!existingReminder.times.includes(currentLocalTime)) {
        existingReminder.times.push(currentLocalTime);
      }

      await existingReminder.save();
      console.log(`[fulfillOrder] Extended existing DailyIntakeReminder for user ${order.user} and medicine ${order.medicine} to ${newEndDate}`);
    } else {
      const days = Math.max(1, order.quantity);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const now = new Date();
      const currentLocalTime = getTimeHHMMInTimezone(now);
      const times = [currentLocalTime];
      if (!times.includes("09:00")) {
        times.push("09:00");
      }

      await DailyIntakeReminder.create({
        user: order.user,
        medicine: order.medicine,
        times,
        endDate,
        enabled: true
      });
      console.log(`[fulfillOrder] Automatically created DailyIntakeReminder for user ${order.user} and medicine ${order.medicine} with times ${times}`);
    }
  } catch (reminderErr) {
    console.error(`[fulfillOrder] Failed to automatically create DailyIntakeReminder:`, reminderErr.message);
  }

  // 3️⃣ Send WhatsApp
  const user = await User.findById(order.user);
  const medicine = await Medicine.findById(order.medicine);

  if (user?.phone) {
    const to = formatWhatsAppNumber(user.phone);
   try {
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to,
        body: `✅ Order Confirmed\n\n💊 Medicine: ${medicine.name}\n📦 Quantity: ${order.quantity}\n🆔 Order ID: ${order._id}\n\nThank you for using Agentic AI Pharmacy 💙`,
      });
      console.log(`WhatsApp message sent to ${to} for order ${order._id}`);
    } catch (err) {
      console.error(`Failed to send WhatsApp message to ${to} for order ${order._id}:`, err.message);
    }
  }

  // 4️⃣ Mark fulfilled (NEW but non-breaking)
  order.isFulfilled = true;
  await order.save();
};

/**
 * CREATE ORDER (CHAT FLOW)
 */
const createOrder = async ({ userId, medicineId, quantity }) => {
    console.log(`[createOrder] Called for userId=${userId}, medicineId=${medicineId}, quantity=${quantity}`);
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
