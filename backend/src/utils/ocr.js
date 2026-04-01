const { recognize } = require("tesseract.js");

const STOP_WORDS = new Set([
  "tab",
  "tablet",
  "tablets",
  "capsule",
  "capsules",
  "syrup",
  "take",
  "after",
  "before",
  "daily",
  "morning",
  "night",
  "doctor",
  "patient",
  "name",
  "age",
  "male",
  "female",
]);

const extractCandidateNames = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const candidates = new Set();

  for (const line of lines) {
    const cleaned = line
      .replace(/\d+\s?(mg|ml|mcg|gm|g)/gi, "")
      .replace(/[^a-zA-Z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned) continue;

    const words = cleaned.split(" ").filter((word) => {
      const lower = word.toLowerCase();
      return word.length > 2 && !STOP_WORDS.has(lower);
    });

    if (!words.length) continue;

    const phrase = words.slice(0, 3).join(" ").trim();
    if (phrase.length >= 3) {
      candidates.add(phrase);
    }
  }

  return Array.from(candidates).slice(0, 20);
};

const extractMedicinesFromFile = async (filePath, mimeType) => {
  if (mimeType === "application/pdf") {
    throw new Error("PDF OCR not supported yet. Please upload image format.");
  }

  const result = await recognize(filePath, "eng", {
    logger: () => {},
  });

  const extractedText = result?.data?.text || "";
  const candidateNames = extractCandidateNames(extractedText);

  return {
    extractedText,
    candidateNames,
  };
};

module.exports = { extractMedicinesFromFile };
