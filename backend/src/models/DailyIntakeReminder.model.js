const mongoose = require("mongoose");

const intakeLogSchema = new mongoose.Schema({
  date: Date,
  time: String,
  status: {
    type: String,
    enum: ["TAKEN", "SKIPPED"],
  },
});

const dailyIntakeReminderSchema = new mongoose.Schema(
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

    enabled: {
      type: Boolean,
      default: true, // USER CONTROL
    },

    times: {
      type: [String], // ["09:00", "21:00"]
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date, // user-defined
      required: true,
    },

    lastNotifiedAt: Date,

    awaitingResponse: {
      type: Boolean,
      default: false,
    },

    logs: [intakeLogSchema], // TAKEN / SKIPPED history
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DailyIntakeReminder",
  dailyIntakeReminderSchema
);
