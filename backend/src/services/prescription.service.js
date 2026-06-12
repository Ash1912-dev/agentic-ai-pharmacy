const Groq = require("groq-sdk");
const { extractTextFromImage, parseMedicinesFromOCRText } = require("../utils/ocr");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Parse a raw LLM text response into JSON, stripping markdown fences.
 */
const parseJsonSafely = (text) => {
  const cleaned = String(text || "").replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

/**
 * Extract medicines from a prescription image using OCR + Groq LLM.
 *
 * Pipeline:
 * 1. Tesseract.js OCR extracts raw text from the image
 * 2. Groq LLM parses the OCR text into structured medicine data
 * 3. Falls back to local regex parser if LLM fails
 *
 * @param {Object} params
 * @param {string} params.filePath - Path to the uploaded image file
 * @param {string} params.mimeType - MIME type of the file
 * @returns {Promise<Array>} Array of {name, dosage, frequency, duration}
 */
const extractMedicinesFromPrescriptionImage = async ({ filePath, mimeType }) => {
  if (!mimeType || !mimeType.startsWith("image/")) {
    throw new Error("Please upload an image prescription (PNG/JPG). PDF support is disabled in demo mode.");
  }

  // 1. OCR extraction
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

  // Keep OCR text within reasonable limits
  const MAX_OCR_CHARS = 8000;
  const safeOcrText = ocrText.length > MAX_OCR_CHARS
    ? ocrText.slice(0, MAX_OCR_CHARS)
    : ocrText;

  const systemPrompt =
    "You are a medical prescription extraction expert. Extract ONLY medicines that are explicitly written on the prescription. Return JSON format only.";

  const userPrompt =
    'Extract ALL medicines from this prescription text. Include: name, dosage (if present), frequency (how often to take), duration (how many days/weeks). Return ONLY valid JSON in this exact format: {"medicines":[{"name":"","dosage":"","frequency":"","duration":""}]}. If no medicines found return {"medicines":[]}.';

  const userContent = `${userPrompt}\n\nOCR extracted text from prescription:\n"""${safeOcrText}"""`;

  // 2. Groq LLM extraction
  let text;
  let usedLLM = false;

  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0,
      max_tokens: 500,
    });

    text = response.choices[0]?.message?.content || null;
    if (text) {
      text = text.replace(/```json|```/g, "").trim();
      usedLLM = true;
    }
  } catch (err) {
    console.error("❌ Groq prescription extraction error:", err.message);
    // Fall through to local parser
    text = null;
  }

  // 3. Parse LLM response
  let medicines = [];

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

  // 4. Fallback to local parser if LLM failed or returned nothing
  if (medicines.length === 0) {
    console.log(
      "📋 Falling back to local prescription parser for OCR text..."
    );
    console.log("📄 OCR Text being parsed:", ocrText.substring(0, 800));
    medicines = parseMedicinesFromOCRText(ocrText);
  }

  if (medicines.length === 0) {
    console.warn(
      "⚠️ No medicines extracted. OCR text length:",
      ocrText.length,
      "Used LLM:",
      usedLLM
    );
    console.warn(
      "Full OCR text that failed to parse:\n",
      ocrText
    );
    throw new Error(
      "Could not extract any medicines from prescription. Please try a clearer image."
    );
  }

  console.log(`✅ Successfully extracted ${medicines.length} medicine(s)`);
  return medicines;
};

module.exports = {
  extractMedicinesFromPrescriptionImage,
};
