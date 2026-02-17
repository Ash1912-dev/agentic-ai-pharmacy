const express = require("express");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const router = express.Router();

/**
 * SIGNUP (Phone-based)
 */
/**
 * SIGNUP (Email/Phone + Password)
 */
router.post("/signup", async (req, res) => {
  const { name, phone, email, password, address, gender, dob } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ message: "Name, phone, and password are required" });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ $or: [{ phone }, { email }] }).select("+password");

    if (user) {
      // Check if the user already has a password (not a legacy user)
      if (user.password) {
        return res.status(409).json({ message: "User already exists. Please login." });
      }

      // MIGRATION: If user exists but HAS NO PASSWORD (legacy user), update them
      const hashedPassword = await bcrypt.hash(password, 10);
      user.name = name;
      user.email = email || user.email;
      user.password = hashedPassword;
      user.address = address || user.address;
      user.gender = gender || user.gender;
      user.dob = dob || user.dob;

      await user.save();

      return res.status(200).json({
        message: "Account upgraded successfully. You can now login.",
        user: { _id: user._id, name: user.name, phone: user.phone, email: user.email },
      });
    }

    // Case 3: User does NOT exist, create a new one
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      address,
      gender,
      dob,
    });

    res.status(201).json({
      message: "Signup successful",
      user: { _id: user._id, name: user.name, phone: user.phone, email: user.email },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/**
 * LOGIN (Email/Phone + Password)
 * Creates session manually
 */
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body; // identifier can be phone or email

  if (!identifier || !password) {
    return res.status(400).json({ message: "Email/Phone and Password are required" });
  }

  try {
    // Find user by phone OR email
    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    }).select("+password"); // Explicitly select password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a password (legacy check)
    if (!user.password) {
      return res.status(403).json({
        message: "Please sign up again to set a password for your account."
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 Manually attach user to session
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      // Remove password from response
      const userObj = user.toObject();
      delete userObj.password;

      res.json({ message: "Login successful", user: userObj });
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
