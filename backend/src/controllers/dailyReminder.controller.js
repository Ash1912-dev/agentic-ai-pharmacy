const DailyIntakeReminder = require("../models/DailyIntakeReminder.model");

/* =====================================================
   CREATE REMINDER
===================================================== */
const createDailyReminder = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { medicineId, times, days } = req.body;

    if (!userId || !medicineId || !times || !days) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(days));

    const reminder = await DailyIntakeReminder.create({
      user: userId,
      medicine: medicineId,
      times,
      endDate,
    });

    res.status(201).json({
      message: "Daily intake reminder created",
      reminder,
    });
  } catch (err) {
    console.error("❌ Create reminder error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET USER REMINDER (FIXES 404)
===================================================== */
const getUserDailyReminder = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { medicineId } = req.params;

    const reminder = await DailyIntakeReminder.findOne({
      user: userId,
      medicine: medicineId,
    });

    if (!reminder) {
      return res.status(404).json(null);
    }

    res.json(reminder);
  } catch (err) {
    console.error("❌ Get reminder error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   UPDATE REMINDER
===================================================== */
const updateDailyReminder = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { times, days } = req.body;

    const reminder = await DailyIntakeReminder.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!reminder) {
      return res
        .status(404)
        .json({ message: "Reminder not found or unauthorized" });
    }

    if (times) {
      reminder.times = times;
    }

    if (days) {
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + Number(days));
      reminder.endDate = newEndDate;
    }

    await reminder.save();

    res.json({
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (err) {
    console.error("❌ Update reminder error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   TOGGLE REMINDER (PAUSE / RESUME)
===================================================== */
const toggleDailyReminder = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    const reminder = await DailyIntakeReminder.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!reminder) {
      return res
        .status(404)
        .json({ message: "Reminder not found or unauthorized" });
    }

    reminder.enabled = !reminder.enabled;
    await reminder.save();

    res.json({
      message: "Reminder status updated",
      reminder,
    });
  } catch (err) {
    console.error("❌ Toggle reminder error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createDailyReminder,
  getUserDailyReminder,
  updateDailyReminder,
  toggleDailyReminder,
};
