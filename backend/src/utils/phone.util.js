/**
 * Canonical phone number utilities.
 *
 * RULE: Phone numbers are always stored as bare 10-digit Indian numbers
 * in MongoDB (e.g. "8329467670"). Formatting for external APIs (Twilio)
 * happens only at the point of use via formatWhatsAppNumber().
 */

/**
 * Sanitize any phone input down to bare 10 digits.
 * Strips +91, 91, +, spaces, dashes, and all non-digit chars,
 * then takes the last 10 digits.
 *
 * @param {string|number} phone - Raw phone value
 * @returns {string} 10-digit phone string
 */
function cleanPhone(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

/**
 * Format a phone number for the Twilio WhatsApp API.
 * Always returns "whatsapp:+91XXXXXXXXXX".
 *
 * @param {string|number} phone - Raw or clean phone value
 * @returns {string} Twilio-formatted WhatsApp number
 */
function formatWhatsAppNumber(phone) {
  const digits = cleanPhone(phone);
  return `whatsapp:+91${digits}`;
}

module.exports = { cleanPhone, formatWhatsAppNumber };
