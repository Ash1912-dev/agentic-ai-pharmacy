const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
  type: String,
  enum: [
    "CREATED",
    "WAITING_PRESCRIPTION",
    "CONFIRMED",
    "REJECTED",
    "FULFILLED",
  ],
  default: "CREATED",
},

    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
