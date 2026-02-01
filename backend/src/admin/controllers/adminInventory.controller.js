const Inventory = require("../../models/Inventory.model");
const Medicine = require("../../models/Medicine.model");

/**
 * ADD STOCK (INCREMENT)
 */
exports.addStock = async (req, res) => {
  try {
    const { medicineId, stock } = req.body;

    if (!medicineId || stock === undefined || stock <= 0) {
      return res
        .status(400)
        .json({ message: "medicineId and positive stock required" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine || !medicine.isActive) {
      return res.status(404).json({ message: "Medicine not found or inactive" });
    }

    let inventory = await Inventory.findOne({ medicine: medicineId });

    if (!inventory) {
      inventory = await Inventory.create({
        medicine: medicineId,
        stock
      });
    } else {
      inventory.stock += stock;
      await inventory.save();
    }

    res.json({
      message: "Stock added successfully",
      inventory
    });
  } catch (error) {
    console.error("Add stock error:", error);
    res.status(500).json({ message: "Failed to add stock" });
  }
};

/**
 * SET STOCK (MANUAL CORRECTION)
 */
exports.setStock = async (req, res) => {
  try {
    const { medicineId, stock, reason } = req.body;

    if (!medicineId || stock === undefined || stock < 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const inventory = await Inventory.findOne({ medicine: medicineId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    inventory.stock = stock;
    await inventory.save();

    res.json({
      message: "Stock updated successfully",
      reason: reason || "Manual correction",
      inventory
    });
  } catch (error) {
    console.error("Set stock error:", error);
    res.status(500).json({ message: "Failed to set stock" });
  }
};

/**
 * VIEW FULL INVENTORY
 */
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate(
        "medicine",
        "name brand price requiresPrescription isActive"
      )
      .sort({ updatedAt: -1 });

    res.json(inventory);
  } catch (error) {
    console.error("Fetch inventory error:", error);
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

/**
 * LOW STOCK ALERTS
 */
exports.getLowStock = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10;

    const lowStock = await Inventory.find({
      stock: { $lte: threshold }
    }).populate("medicine", "name brand price ");

    res.json(lowStock);
  } catch (error) {
    console.error("Low stock error:", error);
    res.status(500).json({ message: "Failed to fetch low stock data" });
  }
};
