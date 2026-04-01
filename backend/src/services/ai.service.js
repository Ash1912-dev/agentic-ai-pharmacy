const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ MUST match a model from your list
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const generateAIResponse = async (prompt) => {
  const response = await axios.post(
    `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 180,
        temperature: 0.2,
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    }
  );

  return response.data.candidates[0].content.parts[0].text;
};

module.exports = { generateAIResponse };
