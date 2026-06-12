const mongoose = require("mongoose");
const { cleanPhone } = require("../utils/phone.util");

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

// Strip phone to bare 10 digits before every save
userSchema.pre("save", function (next) {
  if (this.isModified("phone") && this.phone) {
    this.phone = cleanPhone(this.phone);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
