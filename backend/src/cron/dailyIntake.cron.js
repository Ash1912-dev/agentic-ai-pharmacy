const cron = require("node-cron");
const DailyIntakeReminder = require("../models/DailyIntakeReminder.model");
const twilioClient = require("../config/twilio");
const {
  APP_TIMEZONE,
  getTimeHHMMInTimezone,
  getDateKeyInTimezone,
} = require("../utils/time");

// Format phone to +91XXXXXXXXXX or +XXXXXXXXXX format
const formatPhoneWithCode = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
};

// Run every minute to check if any reminders need to be sent
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const timeNow = getTimeHHMMInTimezone(now);
    const todayKey = getDateKeyInTimezone(now);

    console.log(
      `📅 Daily intake reminder cron running at ${timeNow} (${APP_TIMEZONE})`
    );

    // Find all ACTIVE daily intake reminders within date range and matching time
    const reminders = await DailyIntakeReminder.find({
      enabled: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      times: { $in: [timeNow] },
    }).populate("user medicine");

    console.log(`📦 Found ${reminders.length} active reminders to process`);

    for (const reminder of reminders) {
      // 🔥 IMPORTANT: Only send ONE reminder per day per medicine
      // Check if we've already notified today
      if (
        reminder.lastNotifiedAt &&
        getDateKeyInTimezone(reminder.lastNotifiedAt) === todayKey
      ) {
        console.log(
          `⏭️ Already notified today for ${reminder.medicine.name}, skipping`
        );
        continue;
      }

      const rawPhone = reminder.user.phone;
      const formattedPhone = formatPhoneWithCode(rawPhone);

      console.log(`📤 Sending reminder to: ${formattedPhone}`);

      try {
        const msg = `💊 Medicine Reminder

Take *${reminder.medicine.name}*

Reply:
1️⃣ TAKEN
2️⃣ SKIPPED`;

        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: `whatsapp:${formattedPhone}`,
          body: msg,
        });

        // Update reminder state
        reminder.lastNotifiedAt = now;
        reminder.awaitingResponse = true;
        await reminder.save();

        console.log(`✅ Reminder sent for ${reminder.medicine.name}`);
      } catch (sendError) {
        console.error(
          `❌ Failed to send reminder to ${formattedPhone}:`,
          sendError.message
        );
      }
    }
  } catch (err) {
    console.error("❌ Daily intake cron error:", err.message);
  }
});

module.exports = {};