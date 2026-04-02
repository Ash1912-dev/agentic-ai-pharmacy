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
    console.log(`🔍 Starting OCR on: ${filePath}`);
    // Use local eng.traineddata placed at backend/eng.traineddata
    const langPath = path.resolve(__dirname, "../../");
    console.log(`📂 Lang path: ${langPath}`);

    // Enhanced Tesseract config for medical documents
    const { data } = await Tesseract.recognize(filePath, "eng", {
      langPath,
    });

    const ocrText = String(data?.text || "").trim();
    console.log("✓ OCR extraction complete:");
    console.log(`  - Text length: ${ocrText.length} characters`);
    console.log(`  - Confidence: ${data?.confidence || "N/A"}%`);
    
    if (ocrText.length === 0) {
      console.warn("⚠️ WARNING: OCR returned empty text!");
    }
    
    return ocrText;
  } catch (err) {
    console.error("❌ OCR error", err?.message || err);
    console.error("❌ OCR error details:", err);
    throw new Error("OCR failed while reading prescription image");
  }
};

/**
 * Local fallback parser: Extract medicine info from OCR text using multiple strategies.
 * Strategy 1: Parse numbered medicine lists (1) NAME dosage ...)
 * Strategy 2: Look for ALL-CAPS words followed by dosage/frequency info
 * Strategy 3: Simple keyword-based extraction
 */
const parseMedicinesFromOCRText = (ocrText) => {
  if (!ocrText || ocrText.length < 10) {
    console.warn("⚠️ OCR text too short:", ocrText?.length || 0);
    return [];
  }

  console.log("📋 === OCR TEXT FOR PARSING ===");
  console.log(ocrText);
  console.log("=== END OCR TEXT (Total chars: " + ocrText.length + ") ===\n");

  const medicines = [];
  const lines = ocrText.split("\n").map((l) => l.trim()).filter(Boolean);

  console.log(`📊 Total lines to parse: ${lines.length}`);

  // ============================================
  // STRATEGY 1: Parse numbered lists (1) NAME ...)
  // ============================================
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match: "1) MEDICINE NAME ..." or "1. MEDICINE NAME ..."
    const numberedMatch = line.match(/^(\d+)[.)]\s+(.+?)(?:\s+\(([^)]*)\))?(.*)$/);

    if (numberedMatch) {
      const potentialName = numberedMatch[2].trim();

      // Extract dosage from parentheses or from rest of line
      const dosageFromParens = numberedMatch[3] || "";
      const restOfLine = numberedMatch[4] || "";

      // Look for dosage patterns in rest of line
      const dosageMatch = restOfLine.match(/([0-9.]+\s*(?:mg|ml|%|iu|mcg|units|tabs?|cap|gm|g))/i);
      const dosage = dosageFromParens || dosageMatch?.[0] || "";

      // Combine name and dosage from parentheses
      const fullName = dosageFromParens
        ? `${potentialName} ${dosageFromParens}`.trim()
        : potentialName;

      // Collect frequency and duration from this line and next 2 lines
      let frequency = "";
      let duration = "";

      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        const scanLine = lines[j];
        frequency = extractFrequencyFromText(scanLine) || frequency;
        duration = extractDurationFromText(scanLine) || duration;
      }

      if (fullName.length > 2 && fullName.toLowerCase() !== "rx") {
        medicines.push({
          name: fullName,
          dosage: dosage,
          frequency: frequency,
          duration: duration,
        });
        console.log(`✓ Extracted (Strategy 1): ${fullName}`);
      }
    }
  }

  // ============================================
  // STRATEGY 2: If Strategy 1 found nothing, look for ALL-CAPS words
  // ============================================
  if (medicines.length === 0) {
    console.log("🔍 Strategy 1 found 0 medicines, trying Strategy 2...");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for lines that start with ALL CAPS words (typical medicine names)
      const allCapsMatch = line.match(/^([A-Z][A-Z0-9\s\-]+?)(?:\s+\(([^)]*)\))?(.*)$/);

      if (
        allCapsMatch &&
        !line.match(/^(REG|DATE|NAME|DIAGNOSIS|NEXT|DR|FOLLOWUP|MALE|FEMALE|OF|YEARS)/i) &&
        line.length > 3
      ) {
        const potentialName = allCapsMatch[1].trim();
        const parentheses = allCapsMatch[2] || "";
        const restOfLine = allCapsMatch[3] || "";

        // Skip generic header lines
        if (potentialName.length < 3) continue;

        const fullName = parentheses
          ? `${potentialName} (${parentheses})`
          : potentialName;

        let frequency = extractFrequencyFromText(line) || "";
        let duration = extractDurationFromText(line) || "";

        // Check next line for frequency/duration
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          frequency = frequency || extractFrequencyFromText(nextLine);
          duration = duration || extractDurationFromText(nextLine);
        }

        medicines.push({
          name: fullName,
          dosage: "",
          frequency: frequency,
          duration: duration,
        });
        console.log(`✓ Extracted (Strategy 2): ${fullName}`);
      }
    }
  }

  // ============================================
  // STRATEGY 3: Look for known medicine keywords
  // ============================================
  if (medicines.length === 0) {
    console.log("🔍 Strategy 2 found 0 medicines, trying Strategy 3...");

    const medicineKeywords = [
      "tablet", "capsule", "softgel", "syrup", "injection", "cream",
      "shampoo", "lotion", "drops", "serum", "gel", "spray",
      "suspension", "powder", "ointment"
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // If line contains a medicine type keyword
      if (medicineKeywords.some(kw => line.toLowerCase().includes(kw))) {
        // Extract: the line usually has format "MEDICINE TYPE DOSAGE"
        const parts = line.split(/\s+/);
        
        // Get first few parts as medicine name (usually first 2-5 words)
        let medicineName = "";
        for (let j = 0; j < Math.min(4, parts.length); j++) {
          if (!parts[j].match(/pill|take|dose|after|before|every/i)) {
            medicineName += (medicineName ? " " : "") + parts[j];
          } else {
            break;
          }
        }

        if (medicineName.length > 2) {
          medicines.push({
            name: medicineName,
            dosage: "",
            frequency: extractFrequencyFromText(line),
            duration: extractDurationFromText(line),
          });
          console.log(`✓ Extracted (Strategy 3): ${medicineName}`);
        }
      }
    }
  }

  // ============================================
  // STRATEGY 4: Emergency fallback - extract ANY multi-word segments that look like medicine names
  // ============================================
  if (medicines.length === 0) {
    console.log("🚨 All strategies failed! Trying emergency extraction...");

    // Split text into potential medicine blocks by common delimiters
    const medicineBlocks = ocrText.split(/\n\n+|,\s+(?=[A-Z])/);

    for (const block of medicineBlocks) {
      if (block.length < 3) continue;

      // Extract first line/phrase that looks like a medicine (2-6 words, contains capitals)
      const firstLine = block.split("\n")[0].trim();

      if (
        firstLine.length > 3 &&
        firstLine.length < 150 &&
        /[A-Z]/.test(firstLine) &&
        !firstLine.match(/^(REG|DATE|NAME|DIAGNOSIS|FOLLOW|NEXT|CLINIC|DR)/i)
      ) {
        medicines.push({
          name: firstLine,
          dosage: "",
          frequency: extractFrequencyFromText(block),
          duration: extractDurationFromText(block),
        });
        console.log(`✓ Extracted (Strategy 4): ${firstLine}`);
      }
    }
  }

  // ============================================
  // Cleanup & Deduplication
  // ============================================
  const uniqueMedicines = medicines.reduce((acc, med) => {
    const exists = acc.find(
      (m) => m.name.toLowerCase() === med.name.toLowerCase()
    );
    if (!exists) acc.push(med);
    return acc;
  }, []);

  console.log(`📊 Final extracted medicines: ${uniqueMedicines.length}`);
  uniqueMedicines.forEach((m) => {
    console.log(`  - ${m.name} | Dosage: ${m.dosage} | Freq: ${m.frequency} | Duration: ${m.duration}`);
  });

  return uniqueMedicines;
};
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
