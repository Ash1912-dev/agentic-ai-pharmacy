const express = require("express");
const router = express.Router();

const {
  addStock,
  setStock,
  getInventory,
  getLowStock
} = require("../controllers/adminInventory.controller");

const { adminAuth } = require("../middlewares/adminAuth.middleware");

router.use(adminAuth);

router.get("/", getInventory);
router.get("/low-stock", getLowStock);

router.post("/add", addStock);     // increment
router.post("/set", setStock);     // overwrite

module.exports = router;
