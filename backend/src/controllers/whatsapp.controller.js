const RefillReminder = require("../models/RefillReminder.model");
const DailyIntakeReminder = require("../models/DailyIntakeReminder.model");
const UserMedicineCourse = require("../models/UserMedicineCourse.model");
const { createOrder } = require("../services/order.service");
const twilioClient = require("../config/twilio");

// normalize phone to last 10 digits
const normalizePhone = (p) => p.replace(/\D/g, "").slice(-10);

// Format phone to +91XXXXXXXXXX or +XXXXXXXXXX format
const formatPhoneWithCode = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
};

exports.incomingWhatsApp = async (req, res) => {
  try {
    const message = (req.body.Body || "").trim();
    const from = req.body.From; // whatsapp:+91XXXXXXXXXX
    const phone = normalizePhone(from);

    console.log("📩 Incoming WhatsApp:", message, phone);

    /* =====================================================
       1️⃣ REFILL REMINDER FLOW (HIGHEST PRIORITY)
    ===================================================== */

    const refillReminder = await RefillReminder.findOne({
      awaitingUserAction: true,
    }).populate("user medicine");

    if (
      refillReminder &&
      normalizePhone(refillReminder.user.phone) === phone
    ) {
      // 1️⃣ Reorder
      if (message === "1" && !refillReminder.awaitingQuantity) {
        refillReminder.awaitingQuantity = true;
        await refillReminder.save();

        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: from,
          body: `How many units of *${refillReminder.medicine.name}* would you like to reorder?`,
        });

        return res.send("<Response></Response>");
      }

      // Quantity received
      if (refillReminder.awaitingQuantity && /^\d+$/.test(message)) {
        const quantity = Number(message);

        await createOrder({
          userId: refillReminder.user._id,
          medicineId: refillReminder.medicine._id,
          quantity,
        });

        refillReminder.awaitingUserAction = false;
        refillReminder.awaitingQuantity = false;
        await refillReminder.save();

        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: from,
          body: `✅ Order placed successfully for *${quantity} ${refillReminder.medicine.name}*.`,
        });

        return res.send("<Response></Response>");
      }

      // Ignore refill
      if (message === "2") {
        refillReminder.awaitingUserAction = false;
        refillReminder.awaitingQuantity = false;
        await refillReminder.save();

        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: from,
          body: "👍 No problem. We won't remind you again.",
        });

        return res.send("<Response></Response>");
      }

      // If refill active → DO NOT process intake
      return res.send("<Response></Response>");
    }

    /* =====================================================
       2️⃣ DAILY INTAKE REMINDER
    ===================================================== */

    const intakeReminder = await DailyIntakeReminder.findOne({
      awaitingResponse: true,
    })
      .populate("user medicine")
      .sort({ updatedAt: -1 });

    if (
      intakeReminder &&
      normalizePhone(intakeReminder.user.phone) === phone &&
      ["1", "2"].includes(message)
    ) {
      const status = message === "1" ? "TAKEN" : "SKIPPED";

      intakeReminder.logs.push({
        date: new Date(),
        time: intakeReminder.lastNotifiedAt
          ?.toTimeString()
          .slice(0, 5),
        status,
      });

      intakeReminder.awaitingResponse = false;
      await intakeReminder.save();

      // 🔥 ONLY decrement if TAKEN
      if (status === "TAKEN") {
        const course = await UserMedicineCourse.findOne({
          user: intakeReminder.user._id,
          medicine: intakeReminder.medicine._id,
        });

        if (course) {
          course.remainingQuantity -= 1;
          await course.save();

          console.log("💊 Remaining:", course.remainingQuantity);

          // ✅ TRIGGER REFILL ONE DAY BEFORE END
          if (course.remainingQuantity === 1) {
            const existing = await RefillReminder.findOne({
              user: course.user,
              medicine: course.medicine,
              awaitingUserAction: true,
            });

            if (!existing) {
              // 🔥 Calculate expectedRefillDate (tomorrow, since remainingQty = 1)
              const expectedRefillDate = new Date();
              expectedRefillDate.setDate(expectedRefillDate.getDate() + 1);

              await RefillReminder.create({
                user: course.user,
                medicine: course.medicine,
                expectedRefillDate: expectedRefillDate, // 🔥 REQUIRED FIELD
                // Other fields use defaults:
                // reminderSent: false (default)
                // awaitingUserAction: true (default)
                // awaitingQuantity: false (default)
              });

              await twilioClient.messages.create({
                from: process.env.TWILIO_WHATSAPP_FROM,
                to: `whatsapp:${formatPhoneWithCode(phone)}`,
                body: `🟡 Refill Reminder

You will run out of *${intakeReminder.medicine.name}* tomorrow.

Reply:
1️⃣ Reorder
2️⃣ Ignore`,
              });

              console.log("🔔 Refill reminder sent");
            }
          }
        }
      }

      // Acknowledge intake
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${formatPhoneWithCode(phone)}`,
        body:
          status === "TAKEN"
            ? "✅ Logged. Great job taking your medicine!"
            : "⚠️ Logged as skipped. Please try not to miss doses.",
      });

      return res.send("<Response></Response>");
    }

    return res.send("<Response></Response>");
  } catch (error) {
    console.error("❌ WhatsApp Incoming Error:", error.message);
    return res.send("<Response></Response>");
  }
};