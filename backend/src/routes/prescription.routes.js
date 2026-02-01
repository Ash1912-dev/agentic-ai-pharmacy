const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { uploadPrescription } = require("../controllers/prescription.controller");

router.post("/upload", upload.single("file"), uploadPrescription);

module.exports = router;
