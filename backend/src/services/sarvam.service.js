const axios = require("axios");
const { extractTextFromImage, parseMedicinesFromOCRText } = require("../utils/ocr");

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

  const choice = response?.data?.choices?.[0];
  const rawContent =
    (choice && (choice.message?.content ?? choice.content ?? choice.text)) || null;

  const text = extractContentText(rawContent);
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
  let ocrText;
  try {
    ocrText = await extractTextFromImage(filePath);
  } catch (e) {
    console.error("❌ OCR failed while reading prescription image", e?.message || e);
    throw new Error(
      "Prescription could not be read reliably. Please upload a clearer image."
    );
  }

  ocrText = String(ocrText || "").trim();
  if (!ocrText) {
    throw new Error(
      "Prescription could not be read reliably. Please upload a clearer image."
    );
  }

  // Keep OCR text small for Sarvam; prescriptions are short.
  const MAX_OCR_CHARS = 8000;
  const safeOcrText = ocrText.length > MAX_OCR_CHARS
    ? ocrText.slice(0, MAX_OCR_CHARS)
    : ocrText;

  const systemPrompt =
    "You are a medical prescription extraction expert. Extract ONLY medicines that are explicitly written on the prescription. Return JSON format only.";

  const userPrompt =
    "Extract ALL medicines from this prescription text. Include: name, dosage (if present), frequency (how often to take), duration (how many days/weeks). Return ONLY valid JSON in this exact format: {\"medicines\":[{\"name\":\"\",\"dosage\":\"\",\"frequency\":\"\",\"duration\":\"\"}]}. If no medicines found return {\"medicines\":[]}.";

  // Sarvam's text chat API expects message content to be a string.
  // We pass OCR text from the prescription instead of raw image/base64
  // to keep the prompt small and within context limits.
  const userContent = `${userPrompt}\n\nOCR extracted text from prescription:\n"""${safeOcrText}"""`;

  let text;
  let usedSarvam = false;

  try {
    text = await sarvamChat({
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
    usedSarvam = true;
  } catch (err) {
    const msg = String(err?.message || "");
    if (msg.includes("Sarvam returned empty content")) {
      console.log("⚠️  Sarvam returned empty, trying local parser...");
      // Fall back to local parsing
      text = null;
    } else {
      throw err;
    }
  }

  let medicines = [];

  // Try Sarvam first
  if (text) {
    const parsed = parseJsonSafely(text);
    if (parsed && Array.isArray(parsed.medicines)) {
      medicines = parsed.medicines
        .map((m) => ({
          name: String(m?.name || "").trim(),
          dosage: String(m?.dosage || "").trim(),
          frequency: String(m?.frequency || "").trim(),
          duration: String(m?.duration || "").trim(),
        }))
        .filter((m) => m.name);
    }
  }

  // Fallback to local parser if Sarvam failed or returned nothing
  if (medicines.length === 0) {
    console.log(
      "📋 Falling back to local prescription parser for OCR text..."
    );
    medicines = parseMedicinesFromOCRText(ocrText);
  }

  if (medicines.length === 0) {
    console.warn(
      "⚠️ No medicines extracted. OCR text length: ",
      ocrText.length,
      "Used Sarvam:",
      usedSarvam
    );
    throw new Error(
      "Could not extract any medicines from prescription. Please try a clearer image."
    );
  }

  return medicines;
};

module.exports = {
  sarvamChat,
  extractMedicinesFromPrescriptionImage,
};
