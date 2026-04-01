const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Prescription = require("../models/Prescription.model");
const Order = require("../models/Order.model"); // ✅ Added: Import Order Model
const Medicine = require("../models/Medicine.model");
const Inventory = require("../models/Inventory.model");
const { extractMedicinesFromFile } = require("../utils/ocr");

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



    // 2️⃣ OCR extraction + inventory matching
    const { extractedText, candidateNames } = await extractMedicinesFromFile(
      file.path,
      file.mimetype
    );

    const allMedicines = await Medicine.find({ isActive: true });
    const inventories = await Inventory.find({
      medicine: { $in: allMedicines.map((med) => med._id) },
    });

    const inventoryByMedicineId = new Map(
      inventories.map((inv) => [inv.medicine.toString(), Number(inv.stock || 0)])
    );

    const normalizedText = extractedText.toLowerCase();
    const matchedMedicines = allMedicines.filter((medicine) =>
      normalizedText.includes(medicine.name.toLowerCase())
    );

    const matchedNames = new Set(matchedMedicines.map((med) => med.name.toLowerCase()));
    const unmatchedCandidates = candidateNames.filter(
      (name) => !matchedNames.has(name.toLowerCase())
    );

    const detectedMedicineDetails = [
      ...matchedMedicines.map((med) => {
        const availableQuantity = inventoryByMedicineId.get(med._id.toString()) || 0;
        return {
          name: med.name,
          dosage: "",
          frequency: "",
          duration: "",
          medicineId: med._id,
          inInventory: availableQuantity > 0,
          availableQuantity,
          price: med.price,
          requiresPrescription: Boolean(med.requiresPrescription),
        };
      }),
      ...unmatchedCandidates.map((name) => ({
        name,
        dosage: "",
        frequency: "",
        duration: "",
        medicineId: null,
        inInventory: false,
        availableQuantity: 0,
        price: null,
        requiresPrescription: false,
      })),
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
    console.error("❌ OCR ERROR:", err.message);

    if (err.message.includes("PDF OCR")) {
      return res.status(400).json({
        message: "Please upload an image prescription (PNG/JPG). PDF support coming soon.",
      });
    }

    res.status(500).json({ message: "Failed to scan prescription" });
  }
};

module.exports = { uploadPrescription };