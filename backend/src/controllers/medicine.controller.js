const Medicine = require("../models/Medicine.model");
const Inventory = require("../models/Inventory.model");

const searchMedicines = async (req, res) => {
  try {
    const query = req.query.q || "";

    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });

    const medicinesWithStock = await Promise.all(
      medicines.map(async (med) => {
        const inventory = await Inventory.findOne({
          medicine: med._id, // ✅ correct field
        });

        return {
          ...med.toObject(),
          inStock: inventory ? inventory.stock > 0 : false, // ✅ correct field
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
