const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Prescription = require("../models/Prescription.model");
const Order = require("../models/Order.model"); // ✅ Added: Import Order Model
const { extractMedicinesFromFile } = require("../utils/ocr");

const uploadPrescription = async (req, res) => {
  try {
    const { userId } = req.body; // Kept your original input method
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1️⃣ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });



    // 2️⃣ Gemini-based extraction (IMAGE ONLY)
    let aiResult = await extractMedicinesFromFile(file.path, file.mimetype);
    // Ensure aiResult is an array of objects for detectedMedicines
    if (Array.isArray(aiResult) && typeof aiResult[0] === "string") {
      aiResult = aiResult.map(name => ({ name, dosage: "", frequency: "", duration: "" }));
    } else if (typeof aiResult === "string") {
      // Try to parse as JSON array of names
      try {
        const arr = JSON.parse(aiResult);
        if (Array.isArray(arr)) {
          aiResult = arr.map(name => ({ name, dosage: "", frequency: "", duration: "" }));
        } else {
          aiResult = [];
        }
      } catch {
        aiResult = [];
      }
    }


    // 3️⃣ Save to DB
    const prescription = await Prescription.create({
      user: userId,
      imageUrl: uploadResult.secure_url,
      extractedText: null, // No longer extracting raw text
      detectedMedicines: aiResult,
    });

    // 5️⃣ LINK TO LATEST WAITING ORDER (✅ Added Feature)
    // This looks for an order waiting for a prescription and links this upload to it
    const order = await Order.findOne({
      user: userId,
      status: "WAITING_PRESCRIPTION",
    }).sort({ createdAt: -1 });

    if (order) {
      order.prescription = prescription._id;
      await order.save();
    }

    // cleanup
    fs.unlinkSync(file.path);

    // Kept your original response format

    res.status(201).json({
      medicines: Array.isArray(aiResult) ? aiResult.map(m => m.name) : [],
      prescriptionId: prescription._id,
    });

  } catch (err) {
    console.error("❌ OCR ERROR:", err.message);

    if (err.message.includes("PDF OCR")) {
      return res.status(400).json({
        message: "Please upload an image (PDF support coming soon)",
      });
    }

    res.status(500).json({ message: "Failed to scan prescription" });
  }
};

module.exports = { uploadPrescription };