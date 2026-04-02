const Tesseract = require("tesseract.js");
const path = require("path");

/**
 * Extract plain text from a prescription image using Tesseract OCR.
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

    const { data } = await Tesseract.recognize(filePath, "eng", {
      langPath,
    });

    return String(data?.text || "").trim();
  } catch (err) {
    console.error("❌ OCR error", err?.message || err);
    throw new Error("OCR failed while reading prescription image");
  }
};

module.exports = { extractTextFromImage };
