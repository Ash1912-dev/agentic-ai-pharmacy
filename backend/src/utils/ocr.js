const Tesseract = require("tesseract.js");

const extractTextFromFile = async (filePath, mimeType) => {
  if (mimeType === "application/pdf") {
    throw new Error("PDF OCR not supported yet");
  }

  const result = await Tesseract.recognize(filePath, "eng");
  return result.data.text;
};

module.exports = { extractTextFromFile };
