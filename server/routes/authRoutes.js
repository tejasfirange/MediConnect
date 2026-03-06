const express = require("express");
const router = express.Router();
const {
  createUser,
  registerStepOne,
  completeRegistration,
  loginUser,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/register/step1", registerStepOne);
router.post("/register/step2", completeRegistration);
router.post("/create-user", createUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
