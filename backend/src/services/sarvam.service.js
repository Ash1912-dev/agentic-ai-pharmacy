const axios = require("axios");
const fs = require("fs");

const SARVAM_API_URL =
  process.env.SARVAM_API_URL || "https://api.sarvam.ai/v1/chat/completions";
const SARVAM_CHAT_MODEL = process.env.SARVAM_CHAT_MODEL || "sarvam-m";

const getHeaders = () => {
  const key = process.env.SARVAM_API_KEY;
  if (!key) {
    throw new Error("SARVAM_API_KEY is missing");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
    "api-subscription-key": key,
  };
};

const extractContentText = (content) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part.text === "string") return part.text;
        return "";
      })
      .join("\n")
      .trim();
  }
  return "";
};

const sarvamChat = async ({ messages, model = SARVAM_CHAT_MODEL, temperature = 0.2, maxTokens = 256 }) => {
  const response = await axios.post(
    SARVAM_API_URL,
    {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    },
    {
      headers: getHeaders(),
      timeout: 20000,
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content;
  const text = extractContentText(content);
  if (!text) {
    throw new Error("Sarvam returned empty content");
  }

  return text;
};

const parseJsonSafely = (text) => {
  const cleaned = String(text || "").replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const extractMedicinesFromPrescriptionImage = async ({ filePath, mimeType }) => {
  if (!mimeType || !mimeType.startsWith("image/")) {
    throw new Error("Please upload an image prescription (PNG/JPG). PDF support is disabled in demo mode.");
  }

  const base64 = fs.readFileSync(filePath).toString("base64");

  const systemPrompt =
    "You are a strict medical prescription extraction expert. Extract only medicine names that are explicitly written on the prescription. Do not infer unknown medicines.";

  const userPrompt =
    "Return only valid JSON in this exact schema: {\"medicines\":[{\"name\":\"\",\"dosage\":\"\",\"frequency\":\"\",\"duration\":\"\"}]}. If nothing is readable return {\"medicines\":[]}.";

  const text = await sarvamChat({
    model: SARVAM_CHAT_MODEL,
    maxTokens: 500,
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64}`,
            },
          },
        ],
      },
    ],
  });

  const parsed = parseJsonSafely(text);
  if (!parsed || !Array.isArray(parsed.medicines)) {
    throw new Error("Sarvam returned invalid extraction format");
  }

  return parsed.medicines
    .map((m) => ({
      name: String(m?.name || "").trim(),
      dosage: String(m?.dosage || "").trim(),
      frequency: String(m?.frequency || "").trim(),
      duration: String(m?.duration || "").trim(),
    }))
    .filter((m) => m.name);
};

module.exports = {
  sarvamChat,
  extractMedicinesFromPrescriptionImage,
};
