const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Prescription = require("../models/Prescription.model");
const Order = require("../models/Order.model"); // ✅ Added: Import Order Model
const Medicine = require("../models/Medicine.model");
const Inventory = require("../models/Inventory.model");
const {
  extractMedicinesFromPrescriptionImage,
} = require("../services/sarvam.service");

const uploadPrescription = async (req, res) => {
  try {
    const userId = req.user?._id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1️⃣ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });



    // 2️⃣ Sarvam extraction + inventory matching (no local OCR/Gemini)
    const extracted = await extractMedicinesFromPrescriptionImage({
      filePath: file.path,
      mimeType: file.mimetype,
    });

    const extractedText = extracted
      .map((m) => [m.name, m.dosage, m.frequency, m.duration].filter(Boolean).join(" "))
      .join("\n");

    const allMedicines = await Medicine.find({ isActive: true });
    const inventories = await Inventory.find({
      medicine: { $in: allMedicines.map((med) => med._id) },
    });

    const inventoryByMedicineId = new Map(
      inventories.map((inv) => [inv.medicine.toString(), Number(inv.stock || 0)])
    );

    const normalizedText = extractedText.toLowerCase();
    const matchedMedicines = allMedicines.filter((medicine) => {
      const lowerName = medicine.name.toLowerCase();
      return (
        normalizedText.includes(lowerName) ||
        extracted.some((m) => m.name.toLowerCase().includes(lowerName) || lowerName.includes(m.name.toLowerCase()))
      );
    });

    const matchedNames = new Set(matchedMedicines.map((med) => med.name.toLowerCase()));
    const unmatchedCandidates = extracted
      .map((m) => m.name)
      .filter((name) => !matchedNames.has(name.toLowerCase()));

    const detectedMedicineDetails = [
      ...matchedMedicines.map((med) => {
        const availableQuantity = inventoryByMedicineId.get(med._id.toString()) || 0;
        const extractedItem = extracted.find(
          (item) => item.name.toLowerCase() === med.name.toLowerCase()
        );
        return {
          name: med.name,
          dosage: extractedItem?.dosage || "",
          frequency: extractedItem?.frequency || "",
          duration: extractedItem?.duration || "",
          medicineId: med._id,
          inInventory: availableQuantity > 0,
          availableQuantity,
          price: med.price,
          requiresPrescription: Boolean(med.requiresPrescription),
        };
      }),
      ...unmatchedCandidates.map((name) => {
        const extractedItem = extracted.find(
          (item) => item.name.toLowerCase() === name.toLowerCase()
        );
        return {
          name,
          dosage: extractedItem?.dosage || "",
          frequency: extractedItem?.frequency || "",
          duration: extractedItem?.duration || "",
          medicineId: null,
          inInventory: false,
          availableQuantity: 0,
          price: null,
          requiresPrescription: false,
        };
      }),
    ];


    // 3️⃣ Save to DB
    const prescription = await Prescription.create({
      user: userId,
      imageUrl: uploadResult.secure_url,
      extractedText,
      detectedMedicines: detectedMedicineDetails.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
      })),
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
      medicines: detectedMedicineDetails.map((m) => m.name),
      detectedMedicines: detectedMedicineDetails,
      prescriptionId: prescription._id,
    });

  } catch (err) {
    console.error("❌ Prescription Extraction Error:", err.message, err.stack || "");

    if (err.message.includes("PDF support")) {
      return res.status(400).json({
        message: "Please upload an image prescription (PNG/JPG). PDF support is disabled in demo mode.",
      });
    }

    if (err.message.includes("too large to process") || err.message.includes("remains too large")) {
      return res.status(413).json({
        message: "Prescription image is too large. Please upload a smaller/clearer image (ideally under 1MB).",
      });
    }

    if (err.message.includes("SARVAM_API_KEY is missing")) {
      return res.status(500).json({
        message:
          "AI prescription scanning is not configured on the server. Please set SARVAM_API_KEY and SARVAM_CHAT_MODEL.",
      });
    }

    if (err.message.startsWith("Sarvam API request failed")) {
      return res.status(502).json({
        message: "Prescription scanning service failed. Please try again in a few minutes.",
      });
    }

    if (err.message.includes("Sarvam returned invalid extraction format")) {
      return res.status(500).json({
        message: "Prescription could not be read reliably. Please upload a clearer image.",
      });
    }

    return res.status(500).json({ message: "Failed to scan prescription" });
  }
};

module.exports = { uploadPrescription };