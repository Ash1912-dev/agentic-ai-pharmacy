const cron = require("node-cron");
const RefillReminder = require("../models/RefillReminder.model");
const DailyIntakeReminder = require("../models/DailyIntakeReminder.model");
const twilioClient = require("../config/twilio");

// Format phone to +91XXXXXXXXXX or +XXXXXXXXXX format
const formatPhoneWithCode = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
};

// Run every 20 seconds to check for pending refill reminders
cron.schedule("*/20 * * * * *", async () => {
  try {
    console.log("🔔 Refill reminder notification cron running");

    // 🔥 ONLY find refill reminders where:
    // 1. User is awaiting action (hasn't responded yet)
    // 2. We haven't sent the reminder yet
    // 3. User has an ACTIVE daily intake reminder (prevents false reminders)
    const reminders = await RefillReminder.find({
      awaitingUserAction: true,
      reminderSent: { $ne: true },
    }).populate("user medicine");

    console.log(`📦 Found ${reminders.length} pending refill reminders`);

    for (const reminder of reminders) {
      try {
        // 🔥 VALIDATION: Check if user has an active daily intake reminder
        // This ensures refill reminders are only for users actually tracking doses
        const hasActiveIntake = await DailyIntakeReminder.findOne({
          user: reminder.user._id,
          medicine: reminder.medicine._id,
          enabled: true,
        });

        if (!hasActiveIntake) {
          console.log(
            `⏭️ Skipping refill reminder for ${reminder.medicine.name} - no active daily intake`
          );
          // Mark as sent anyway to avoid re-processing
          reminder.reminderSent = true;
          await reminder.save();
          continue;
        }

        const formattedPhone = formatPhoneWithCode(reminder.user.phone);

        console.log(`📤 Sending refill reminder to: ${formattedPhone}`);

        const msg = `🟡 Refill Reminder

You will run out of *${reminder.medicine.name}* soon.

Reply:
1️⃣ Reorder now
2️⃣ Ignore`;

        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: `whatsapp:${formattedPhone}`,
          body: msg,
        });

        reminder.reminderSent = true;
        reminder.lastNotifiedAt = new Date();
        await reminder.save();

        console.log(`✅ Refill reminder sent to ${reminder.user.phone}`);
      } catch (sendError) {
        console.error(
          `❌ Failed to send refill reminder:`,
          sendError.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Refill reminder cron error:", error.message);
  }
});

module.exports = {};