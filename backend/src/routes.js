const express = require("express");
const router = express.Router();

const medicineRoutes = require("./routes/medicine.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const orderRoutes = require("./routes/order.routes");
const prescriptionRoutes = require("./routes/prescription.routes");
const agentRoutes = require("./routes/agent.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");
const dailyReminderRoutes = require("./routes/dailyReminder.routes");
const authRoutes = require("./routes/auth.routes");
const localAuthRoutes = require("./routes/auth.local.routes");
// Updated: Changed import to const/require
const adminAuthRoutes = require("./admin/routes/adminAuth.routes");
const adminMedicineRoutes = require("./admin/routes/adminMedicine.routes.js");
const adminInventoryRoutes = require("./admin/routes/adminInventory.routes");
const adminPrescriptionRoutes = require("./admin/routes/adminPrescription.routes");
const adminOrderRoutes = require("./admin/routes/adminOrder.routes");
// APIs
router.use("/api/auth", authRoutes);
router.use("/api/medicines", medicineRoutes);
router.use("/api/inventory", inventoryRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/prescriptions", prescriptionRoutes);
router.use("/api/agent", agentRoutes);
router.use("/api/whatsapp", whatsappRoutes);
router.use("/api/daily-reminder", dailyReminderRoutes);
router.use("/api/auth", localAuthRoutes);
router.use("/api/admin/inventory", adminInventoryRoutes);
// Updated: Changed app.use to router.use
router.use("/api/admin/auth", adminAuthRoutes);
router.use("/api/admin/medicines", adminMedicineRoutes);
router.use("/api/admin/prescriptions", adminPrescriptionRoutes);
router.use("/api/admin/orders", adminOrderRoutes);
router.use(
  "/api/admin/prescriptions",
  require("./admin/routes/adminPrescription.routes")
);
router.use(
  "/api/admin/orders",
  require("./admin/routes/adminOrder.routes")
);

module.exports = router;