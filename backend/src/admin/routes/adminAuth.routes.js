const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminAuth.controller");

// =======================
// ADMIN LOGIN
// =======================
router.post("/login", adminLogin);

// =======================
// TEMP DEV ONLY – CREATE ADMIN
// REMOVE AFTER USE
// =======================
router.post("/create-dev-admin", async (req, res) => {
  const Admin = require("../models/Admin.model");

  const existing = await Admin.findOne({ email: "admin@pharmacy.com" });
  if (existing) {
    return res.json({ message: "Admin already exists" });
  }

  const admin = await Admin.create({
    name: "Super Admin",
    email: "admin@pharmacy.com",
    password: "admin123",
    role: "SUPER_ADMIN"
  });

  res.json({ message: "Admin created", admin });
});

module.exports = router;
