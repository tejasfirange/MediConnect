const express = require("express");
const router = express.Router();

const { 
  createDoctor, 
  getDoctorProfile, 
  updateDoctorProfile 
} = require("../controllers/doctorController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/createdoctor", verifyToken, createDoctor);
router.get("/me", verifyToken, getDoctorProfile);
router.put("/update", verifyToken, updateDoctorProfile);

module.exports = router;