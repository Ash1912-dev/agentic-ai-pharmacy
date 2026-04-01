

const fs = require("fs");
const path = require("path");
const { generateAIResponse } = require("../services/ai.service");


// Reads image as base64 and sends to Gemini for medicine extraction
const extractMedicinesFromFile = async (filePath, mimeType) => {
  const fileData = fs.readFileSync(filePath);
  const base64Image = fileData.toString("base64");
  const prompt = `Extract the list of medicine names from this prescription image. Return only a JSON array of medicine names. Image (base64): ${base64Image}`;
  const response = await generateAIResponse(prompt);
  // Remove code block markers and whitespace if present
  let cleaned = response.replace(/```json|```/g, "").trim();
  try {
    const medicines = JSON.parse(cleaned);
    return medicines;
  } catch (e) {
    return cleaned;
  }
};

module.exports = { extractMedicinesFromFile };
