const { sarvamChat } = require("./sarvam.service");

const generateAIResponse = async (prompt) => {
  return sarvamChat({
    temperature: 0.2,
    maxTokens: 220,
    messages: [
      {
        role: "system",
        content:
          "You are an expert pharmacy assistant. Follow safety and return exactly what is asked.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
};

module.exports = { generateAIResponse };
