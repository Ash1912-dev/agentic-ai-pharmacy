const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Prescription = require("../models/Prescription.model");
const Order = require("../models/Order.model"); // ✅ Added: Import Order Model
const { extractTextFromFile } = require("../utils/ocr");
const { parseMedicinesFromText } = require("../services/prescription.service");

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

    // 2️⃣ OCR (IMAGE ONLY)
    const extractedText = await extractTextFromFile(
      file.path,
      file.mimetype
    );

    // 3️⃣ AI Parsing
    const aiResult = await parseMedicinesFromText(extractedText);

    // 4️⃣ Save to DB
    const prescription = await Prescription.create({
      user: userId,
      imageUrl: uploadResult.secure_url,
      extractedText,
      detectedMedicines: aiResult.medicines,
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
      medicines: aiResult.medicines.map(m => m.name),
      rawText: extractedText,
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