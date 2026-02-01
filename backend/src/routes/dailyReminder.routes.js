const express = require("express");
const router = express.Router();

const {
  createDailyReminder,
  updateDailyReminder,
  getUserDailyReminder,
  toggleDailyReminder,
} = require("../controllers/dailyReminder.controller");

const auth = require("../middlewares/auth.middleware");

// 🔒 Create reminder
router.post("/create", auth, createDailyReminder);

// 🔒 Get reminder for a user + medicine
router.get(
  "/user/:medicineId",
  auth,
  getUserDailyReminder
);

// 🔒 Update reminder timings / days
router.put("/update/:id", auth, updateDailyReminder);

// 🔒 Pause / Resume reminder
router.put("/toggle/:id", auth, toggleDailyReminder);

module.exports = router;
