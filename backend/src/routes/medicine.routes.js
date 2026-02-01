const express = require("express");
const { searchMedicines } = require("../controllers/medicine.controller");

const router = express.Router();

router.get("/search", (req, res, next) => {
  console.log("✅ Medicine search route HIT");
  next();
}, searchMedicines);

module.exports = router;
