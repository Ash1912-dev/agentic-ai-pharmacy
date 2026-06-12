const { pharmacistChat } = require("../services/ai.service");
const langfuse = require("../config/langfuse");
const User = require("../models/User.model");
const Order = require("../models/Order.model");
const UserMedicineCourse = require("../models/UserMedicineCourse.model");
const DailyIntakeReminder = require("../models/DailyIntakeReminder.model");

/**
 * Build user context object for the AI pharmacist.
 * Fetches user profile, recent orders, active medicine courses, and reminders.
 */
const buildUserContext = async (userId) => {
  try {
    const [user, recentOrders, activeCourses, activeReminders] = await Promise.all([
      User.findById(userId).lean(),
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("medicine", "name brand price category requiresPrescription")
        .lean(),
      UserMedicineCourse.find({ user: userId, remainingQuantity: { $gt: 0 } })
        .populate("medicine", "name brand")
        .lean(),
      DailyIntakeReminder.find({ user: userId, enabled: true })
        .populate("medicine", "name")
        .lean(),
    ]);

    return {
      name: user?.name,
      phone: user?.phone,
      gender: user?.gender,
      recentOrders: recentOrders.map((o) => ({
        medicine: o.medicine?.name,
        quantity: o.quantity,
        status: o.status,
        date: o.createdAt,
      })),
      activeCourses: activeCourses.map((c) => ({
        medicine: c.medicine?.name,
        remaining: c.remainingQuantity,
        total: c.totalQuantity,
      })),
      activeReminders: activeReminders.map((r) => ({
        medicine: r.medicine?.name,
        times: r.times,
      })),
    };
  } catch (err) {
    console.error("⚠️ Failed to build user context:", err.message);
    return {};
  }
};

const agentMessage = async (req, res) => {
  const userId = req.user?._id?.toString();
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const source = req.body?.source || "web";

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  if (message.length > 1000) {
    return res.status(400).json({ message: "Message too long. Maximum 1000 characters." });
  }

  // Session ID: userId + today's date → history persists within a day
  const sessionId = `${userId}-${new Date().toISOString().slice(0, 10)}`;

  // Create Langfuse trace for observability
  let trace;
  try {
    trace = langfuse.trace({
      name: "pharmacist-chat",
      userId,
      input: message,
      metadata: { sessionId, source },
    });
  } catch (err) {
    console.warn("⚠️ Langfuse trace creation failed:", err.message);
  }

  try {
    // Build user context (fetched once per session via the pharmacistChat seeding)
    const userContext = await buildUserContext(userId);

    // Langfuse generation span around the Groq call
    let generation;
    try {
      if (trace) {
        generation = trace.generation({
          name: "groq-pharmacist-chat",
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          input: message,
          metadata: { sessionId, source, contextKeys: Object.keys(userContext) },
        });
      }
    } catch (err) {
      console.warn("⚠️ Langfuse generation creation failed:", err.message);
    }

    const reply = await pharmacistChat({
      userId,
      sessionId,
      message,
      userContext,
      source,
    });

    // Close Langfuse generation
    try {
      if (generation) {
        generation.end({ output: reply });
      }
      if (trace) {
        trace.update({ output: reply });
      }
    } catch (err) {
      console.warn("⚠️ Langfuse generation end failed:", err.message);
    }

    return res.json({ reply, sessionId });

  } catch (error) {
    console.error("🔥 AGENT ERROR:", error.message);

    try {
      if (trace) {
        trace.update({ output: error.message, level: "ERROR" });
      }
    } catch (_) { /* ignore langfuse errors */ }

    return res.status(500).json({
      message: "Agent failed",
      error: error.message || error.toString(),
    });
  }
};

module.exports = { agentMessage };
