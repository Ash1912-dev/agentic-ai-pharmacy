const client = require("../config/twilio");
const { formatWhatsAppNumber } = require("../utils/phone.util");

/**
 * Sends a WhatsApp message using Twilio.
 * Accepts a raw phone number (any format) — formatting is handled internally.
 *
 * @param {string} to - Raw phone number (e.g. "8329467670", "+918329467670")
 * @param {string} message - Message body
 */
const sendWhatsAppMessage = async (to, message) => {
  try {
    const formattedTo = formatWhatsAppNumber(to);

    console.log("📤 SENDING WHATSAPP TO:", formattedTo);

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: formattedTo,
      body: message,
    });

    console.log("✅ WHATSAPP SENT, SID:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ WHATSAPP SEND FAILED:", error.message);
    throw error;
  }
};

module.exports = { sendWhatsAppMessage };

