const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to not conflict
  },

  password: {
    type: String,
    select: false, // Don't return password by default
  },

  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },

  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"],
  },

  dob: {
    type: Date,
  },

  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
