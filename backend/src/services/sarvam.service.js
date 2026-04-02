const axios = require("axios");
const fs = require("fs");

// Optional image compressor for large prescriptions. If unavailable, we fall back
// to simple size checks and ask the user to upload a smaller image.
let sharp = null;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  sharp = require("sharp");
} catch {
  sharp = null;
}

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
  let response;
  try {
    response = await axios.post(
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
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error("❌ Sarvam API error", status || "no-status", data || err.message);
    const details =
      (data && (data.error?.message || data.message)) ||
      (err.message && String(err.message));
    throw new Error(
      `Sarvam API request failed${status ? ` (${status})` : ""}${details ? `: ${details}` : ""}`
    );
  }

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

  const originalBuffer = fs.readFileSync(filePath);

  // Conservative cap so that the base64 string stays well within
  // Sarvam's 64k token window. 80KB → ~110KB base64 → ~27k tokens.
  const MAX_IMAGE_BYTES = 80 * 1024; // 80 KB

  let imageBuffer = originalBuffer;

  if (originalBuffer.length > MAX_IMAGE_BYTES) {
    if (!sharp) {
      throw new Error(
        "Prescription image is too large to process on this server. Please upload a smaller/clearer image (under ~250KB)."
      );
    }

    try {
      imageBuffer = await sharp(originalBuffer)
        .resize({ width: 1024, height: 1024, fit: "inside" })
        .jpeg({ quality: 70 })
        .toBuffer();
    } catch (e) {
      console.error("❌ Failed to compress prescription image with sharp", e.message || e);
      throw new Error(
        "Prescription image could not be processed. Please upload a smaller/clearer image."
      );
    }

    if (imageBuffer.length > MAX_IMAGE_BYTES) {
      throw new Error(
        "Prescription image remains too large after compression. Please upload a smaller/clearer image."
      );
    }
  }

  const base64 = imageBuffer.toString("base64");

  // Extra safety: short-circuit if the base64 text is still huge for any reason.
  // Roughly 1 token ≈ 4 characters. Keep under ~40k tokens.
  const MAX_BASE64_CHARS = 160000; // ~40k tokens
  if (base64.length > MAX_BASE64_CHARS) {
    throw new Error(
      "Prescription image text representation is too large to send to the AI safely. Please upload a smaller/clearer image."
    );
  }

  const systemPrompt =
    "You are a strict medical prescription extraction expert. Extract only medicine names that are explicitly written on the prescription. Do not infer unknown medicines.";

  const userPrompt =
    "Return only valid JSON in this exact schema: {\"medicines\":[{\"name\":\"\",\"dosage\":\"\",\"frequency\":\"\",\"duration\":\"\"}]}. If nothing is readable return {\"medicines\":[]}.";

  // Sarvam's text chat API expects message content to be a string.
  // We embed a short description plus a data URL representation of the image
  // so the payload matches the expected schema.
  const userContent = `${userPrompt}\n\nPrescription image data URL: data:${mimeType};base64,${base64}`;

  const text = await sarvamChat({
    model: SARVAM_CHAT_MODEL,
    maxTokens: 500,
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: userContent,
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
