const express = require("express");
const router = express.Router();

const {
  createMedicine,
  getAllMedicinesAdmin,
  updateMedicine,
  toggleMedicineStatus,
} = require("../controllers/adminMedicine.controller");

const { adminAuth } = require("../middlewares/adminAuth.middleware");

router.use(adminAuth);

router.post("/", createMedicine);
router.get("/", getAllMedicinesAdmin);
router.put("/:id", updateMedicine);
router.patch("/:id/toggle", toggleMedicineStatus);

module.exports = router;
