const mongoose = require("mongoose");

const userMedicineCourseSchema = new mongoose.Schema(
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

    totalQuantity: {
      type: Number,
      required: true,
    },

    remainingQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "UserMedicineCourse",
  userMedicineCourseSchema
);
