const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { uploadPrescription } = require("../controllers/prescription.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/upload", auth, upload.single("file"), uploadPrescription);

module.exports = router;
