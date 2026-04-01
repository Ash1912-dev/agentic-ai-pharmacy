const Medicine = require("../models/Medicine.model");
const Inventory = require("../models/Inventory.model");

const searchMedicines = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();

    const medicineFilter = {
      isActive: true,
      ...(query
        ? {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { brand: { $regex: query, $options: "i" } },
            ],
          }
        : {}),
    };

    const medicines = await Medicine.find(medicineFilter).sort({ name: 1 });

    const medicinesWithStock = await Promise.all(
      medicines.map(async (med) => {
        const inventory = await Inventory.findOne({
          medicine: med._id, // ✅ correct field
        });

        const availableQuantity = inventory ? Number(inventory.stock || 0) : 0;

        return {
          ...med.toObject(),
          availableQuantity,
          inStock: availableQuantity > 0,
        };
      })
    );

    res.status(200).json(medicinesWithStock);
  } catch (error) {
    console.error("Medicine search error:", error);
    res.status(500).json({ message: "Medicine search failed" });
  }
};

module.exports = {
  searchMedicines,
};
