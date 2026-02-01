const express = require("express");
const router = express.Router();

const {
  getAllPrescriptions,
  getPrescriptionById,
  approvePrescription,
  rejectPrescription,
} = require("../controllers/adminPrescription.controller");

const {
  adminAuth,
} = require("../middlewares/adminAuth.middleware");

// 🔐 Protect all admin prescription routes
router.use(adminAuth);

// 📄 Get all prescriptions
router.get("/", getAllPrescriptions);

// 📄 Get single prescription
router.get("/:id", getPrescriptionById);

// ✅ Verify prescription
router.patch("/:id/verify", approvePrescription);

// ❌ Reject prescription
router.patch("/:id/reject", rejectPrescription);

module.exports = router;
