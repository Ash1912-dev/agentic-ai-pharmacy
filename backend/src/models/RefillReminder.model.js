const mongoose = require("mongoose");

const refillReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    expectedRefillDate: {
      type: Date,
      required: true,
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },

    lastNotifiedAt: Date,

    awaitingUserAction: {
      type: Boolean,
      default: true,
    },

    awaitingQuantity: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RefillReminder", refillReminderSchema);
