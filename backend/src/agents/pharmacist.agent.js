/**
 * Legacy pharmacist agent prompt file.
 *
 * The system prompt is now embedded directly in services/ai.service.js
 * as part of the Groq-powered RxAssist pharmacist.
 *
 * This file is kept for backward compatibility — nothing imports from it.
 */

const pharmacistSystemPrompt = "DEPRECATED — see services/ai.service.js";

module.exports = { pharmacistSystemPrompt };
