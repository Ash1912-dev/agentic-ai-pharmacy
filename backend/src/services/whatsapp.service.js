const client = require("../config/twilio");

/**
 * Sends a WhatsApp message using Twilio
 * @param {string} to - Phone number (with or without 'whatsapp:' prefix)
 * @param {string} message - Message body
 */
const sendWhatsAppMessage = async (to, message) => {
  try {
    const formattedTo = to.startsWith("whatsapp:")
      ? to
      : `whatsapp:${to}`;

    console.log("📤 SENDING WHATSAPP TO:", formattedTo);

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM, // must already be whatsapp:+1415...
      to: formattedTo,
      body: message,
    });

    console.log("✅ WHATSAPP SENT, SID:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ WHATSAPP SEND FAILED:", error.message);
    throw error; // IMPORTANT: do not swallow errors
  }
};

module.exports = { sendWhatsAppMessage };
