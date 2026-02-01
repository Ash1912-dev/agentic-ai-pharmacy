const Inventory = require("../models/Inventory.model");
const Medicine = require("../models/Medicine.model");

const checkInventory = async (req, res) => {
  try {
    console.log("🔥 INVENTORY API HIT");
    console.log("REQ BODY RAW:", req.body);

    let { medicineId, quantity } = req.body;

    quantity = Number(quantity);
    console.log("PARSED quantity:", quantity, typeof quantity);

    if (!medicineId || isNaN(quantity)) {
      return res.status(400).json({
        message: "medicineId and numeric quantity are required",
      });
    }

    const inventory = await Inventory.findOne({ medicine: medicineId });
    console.log("INVENTORY FOUND:", inventory);

    if (!inventory) {
      return res.json({
        available: false,
        message: "Medicine not found in inventory",
      });
    }

    const medicine = await Medicine.findById(medicineId);
    console.log("MEDICINE FOUND:", medicine.name);

    const available = inventory.stock >= quantity;

    console.log(
      "STOCK:", inventory.stock,
      "REQ:", quantity,
      "AVAILABLE:", available
    );

    return res.json({
      available,
      stock: inventory.stock,
      requiresPrescription: medicine.prescriptionRequired,
    });

  } catch (error) {
    console.error("Inventory check error:", error);
    return res.status(500).json({ message: "Inventory check failed" });
  }
};

module.exports = { checkInventory };
