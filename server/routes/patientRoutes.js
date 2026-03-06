const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerPatient,
  getPatientProfile,
  getPatientHistory,
  getPatientHistoryById,
  updatePatientProfile,
} = require("../controllers/patientController");

router.post("/register-patient",registerPatient);
router.get("/me", authMiddleware, getPatientProfile);
router.put("/update", authMiddleware, updatePatientProfile);
router.get("/history", authMiddleware, getPatientHistory);
router.get("/history/:id", authMiddleware, getPatientHistoryById);

module.exports = router;
