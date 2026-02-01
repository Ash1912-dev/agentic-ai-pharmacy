const Medicine = require("../../models/Medicine.model");

/**
 * CREATE MEDICINE
 */
exports.createMedicine = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      requiresPrescription,
      typicalDurationDays,
    } = req.body;

    if (!name || !brand || price === undefined) {
      return res.status(400).json({
        message: "Name, brand and price are required",
      });
    }

    const medicine = await Medicine.create({
      name: name.trim(),
      brand: brand.trim(),
      category,
      price: Number(price),
      requiresPrescription,
      typicalDurationDays,
    });

    res.status(201).json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create medicine" });
  }
};

/**
 * GET ALL MEDICINES
 */
exports.getAllMedicinesAdmin = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch {
    res.status(500).json({ message: "Failed to fetch medicines" });
  }
};

/**
 * UPDATE MEDICINE (EDIT)
 */
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update medicine" });
  }
};

/**
 * TOGGLE STATUS
 */
exports.toggleMedicineStatus = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicine.isActive = !medicine.isActive;
    await medicine.save();

    res.json(medicine);
  } catch {
    res.status(500).json({ message: "Failed to toggle medicine" });
  }
};
