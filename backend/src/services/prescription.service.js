const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";


const parseMedicinesFromText = async (text) => {
  const prompt = `
You are a medical assistant.

Extract medicines from this prescription text.
Return ONLY valid JSON. No explanation.

Text:
${text}

Format:
{
  "medicines": [
    {
      "name": "",
      "dosage": "",
      "frequency": "",
      "duration": ""
    }
  ]
}
`;

  let response;
  try {
    response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );
  } catch (err) {
    console.error("❌ GEMINI API ERROR:", err.response?.data || err.message);
    throw new Error("Gemini API call failed");
  }

  if (
    !response.data ||
    !Array.isArray(response.data.candidates) ||
    response.data.candidates.length === 0
  ) {
    throw new Error("Gemini returned no candidates");
  }

  const raw =
    response.data.candidates[0]?.content?.parts?.[0]?.text;

  if (!raw) {
    throw new Error("Gemini response malformed");
  }

  const cleaned = raw.replace(/```json|```/g, "").trim();

  console.log("🧠 GEMINI RAW RESPONSE:\n", cleaned);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ GEMINI JSON PARSE FAILED");
    throw new Error("Gemini returned invalid JSON");
  }

  return parsed;
};

module.exports = { parseMedicinesFromText };
