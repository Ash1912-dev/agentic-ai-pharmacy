const Tesseract = require("tesseract.js");
const path = require("path");

/**
 * Extract plain text from a prescription image using Tesseract OCR.
 * Enhanced with better configuration for medical prescriptions.
 *
 * @param {string} filePath - Absolute/relative path to the image file.
 * @returns {Promise<string>} OCR text
 */
const extractTextFromImage = async (filePath) => {
  if (!filePath) {
    throw new Error("OCR: file path is required");
  }

  try {
    // Use local eng.traineddata placed at backend/eng.traineddata
    const langPath = path.resolve(__dirname, "../../");

    // Enhanced Tesseract config for medical documents
    const { data } = await Tesseract.recognize(filePath, "eng", {
      langPath,
    });

    const ocrText = String(data?.text || "").trim();
    console.log("✓ OCR extracted text length:", ocrText.length, "chars");
    return ocrText;
  } catch (err) {
    console.error("❌ OCR error", err?.message || err);
    throw new Error("OCR failed while reading prescription image");
  }
};

/**
 * Local fallback parser: Extract medicine info from OCR text using regex patterns.
 * Works when Sarvam fails or returns empty.
 *
 * Patterns:
 * - Medicine names at start of lines (often capitalized)
 * - Dosage info in parentheses or after numbers
 * - Frequency info (after, before, daily, etc.)
 * - Duration (usually # days)
 */
const parseMedicinesFromOCRText = (ocrText) => {
  if (!ocrText || ocrText.length < 10) return [];

  const medicines = [];
  const lines = ocrText.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentMedicine = null;

  for (const line of lines) {
    // Skip headers, dates, and non-medicine lines
    if (
      line.match(/^(Reg\.|Date|Name|Diagnosis|Next Visit|Dr\.|Clinic)/i) ||
      line.match(/^[0-9]+ years/) ||
      line.length < 3
    ) {
      continue;
    }

    // Pattern: "N) MEDICINE NAME (variants) (dosage)"
    const medicineMatch = line.match(
      /^\d+\)\s+([A-Z][A-Z0-9\s\-]+?)(?:\s*\(([^)]*)\))*(.*)$/i
    );

    if (medicineMatch) {
      const medicineName = medicineMatch[1]
        .trim()
        .replace(/\s{2,}/g, " ")
        .toUpperCase();
      const dosageInfo = medicineMatch[2] || "";
      const restOfLine = medicineMatch[3] || "";

      // Skip very generic lines
      if (medicineName.length < 3 || medicineName === "RX") continue;

      currentMedicine = {
        name: medicineName,
        dosage: extractDosageFromText(dosageInfo + " " + restOfLine),
        frequency: extractFrequencyFromText(line),
        duration: extractDurationFromText(line),
      };

      if (currentMedicine.name) {
        medicines.push(currentMedicine);
      }
    } else if (
      currentMedicine &&
      (line.match(/^\d+/)
        ? false
        : line.match(/pill|tablet|capsule|ml|drops|spray|serum|shampoo|gel/i))
    ) {
      // Continuation of previous medicine (usage instructions)
      currentMedicine.frequency = extractFrequencyFromText(
        (currentMedicine.frequency || "") + " " + line
      );
      currentMedicine.duration = extractDurationFromText(
        (currentMedicine.duration || "") + " " + line
      );
    }
  }

  // Cleanup: remove duplicates and empty entries
  return medicines
    .filter(
      (m, idx, arr) =>
        m.name &&
        m.name.length > 2 &&
        arr.findIndex((x) => x.name === m.name) === idx
    )
    .map((m) => ({
      name: m.name.trim(),
      dosage: m.dosage?.trim() || "",
      frequency: m.frequency?.trim() || "",
      duration: m.duration?.trim() || "",
    }));
};

const extractDosageFromText = (text) => {
  const dosageMatch = text.match(
    /([0-9.]+\s*(?:mg|ml|%|iu|mcg|units|tabs?|cap))/gi
  );
  return dosageMatch ? dosageMatch.join(" ") : "";
};

const extractFrequencyFromText = (text) => {
  const frequencyPatterns = [
    /o?d(\s+\/\s+day)?(\s+at\s+.+)?/i,
    /twice\s+(?:daily|a\s+day)/i,
    /three?\s+times?\s+(?:daily|a\s+day)/i,
    /(?:after\s+)?(?:breakfast|lunch|dinner|night)/i,
    /before\s+(?:sleep|bed)/i,
    /(?:alternate|every other)\s+day/i,
    /bedtime/i,
    /morning/i,
    /evening/i,
  ];

  for (const pattern of frequencyPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return "";
};

const extractDurationFromText = (text) => {
  const durationMatch = text.match(
    /(\d+)\s*(?:days?|weeks?|months?|years?)/i
  );
  return durationMatch ? durationMatch[0] : "";
};

module.exports = { extractTextFromImage, parseMedicinesFromOCRText };
