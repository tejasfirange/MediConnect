const express = require("express");
const router = express.Router();

const { createDoctor } = require("../controllers/doctorController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/createdoctor", verifyToken, createDoctor);

module.exports = router;