const pool = require("../config/db");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/tokenGenerator"); // already exists in utils
const sendEmail = require("../services/emailService"); // new email service for sending reset links 

/* =========================
   PASSWORD HASH FUNCTION
========================= */

const hashPassword = (password) => CryptoJS.SHA256(password).toString();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const isValidEmail = (value) => EMAIL_REGEX.test(String(value || "").trim().toLowerCase());
const isValidPhone = (value) => PHONE_REGEX.test(String(value || "").trim());

/* =========================
   REGISTER STEP 1
========================= */

const createUser = async (req, res) => {
  return registerStepOne(req, res);
};

const registerStepOne = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required"
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured"
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await pool.query("SELECT email FROM users WHERE email=$1", [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "User already exists with this email"
      });
    }

    const passwordHash = hashPassword(password);

    const registrationToken = jwt.sign(
      { type: "registration", email: normalizedEmail, passwordHash },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.json({
      message: "Step 1 complete. Continue with role and profile details.",
      registrationToken,
      email: normalizedEmail,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   COMPLETE REGISTRATION
========================= */

const completeRegistration = async (req, res) => {

  const client = await pool.connect();

  try {

    const { registrationToken, role, details = {} } = req.body;

    if (!registrationToken || !role) {
      return res.status(400).json({
        message: "registrationToken and role are required"
      });
    }

    const decoded = jwt.verify(
      registrationToken,
      process.env.JWT_SECRET
    );

    const { email, passwordHash } = decoded;

    const { name, dob, gender, contact_no, registration_no, qualification } = details;
    const trimmedContactNo = String(contact_no || "").trim();

    if (!name) {
      return res.status(400).json({
        message: "details.name is required"
      });
    }
    if (trimmedContactNo && !isValidPhone(trimmedContactNo)) {
      return res.status(400).json({ message: "Contact number must be exactly 10 digits" });
    }

    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT email FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "User already exists with this email"
      });
    }

    await client.query(
      "INSERT INTO users (email, role, password) VALUES ($1,$2,$3)",
      [email, role, passwordHash]
    );

    if (role === "patient") {

      await client.query(
        `INSERT INTO patient_details (email, name, dob, gender, contact_no)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, name, dob || null, gender || null, trimmedContactNo || null]
      );

    } else {

      await client.query(
        `INSERT INTO doctor_details
        (email,name,dob,gender,contact_no,registration_no,qualification)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          email,
          name,
          dob || null,
          gender || null,
          trimmedContactNo || null,
          registration_no || null,
          qualification || null
        ]
      );
    }

    await client.query("COMMIT");

    const authToken = jwt.sign(
      { email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Registration completed successfully",
      user: { email, role },
      token: authToken
    });

  } catch (error) {

    await client.query("ROLLBACK");

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Registration token expired. Restart step 1."
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid registration token"
      });
    }

    return res.status(500).json({
      message: error.message
    });

  } finally {
    client.release();
  }
};

/* =========================
   LOGIN
========================= */

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [normalizedEmail]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const dbUser = user.rows[0];

    const hashedPassword = hashPassword(password);

    if (hashedPassword !== dbUser.password) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        email: dbUser.email,
        role: dbUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
const forgotPassword = async (req, res) => {

  const { email } = req.body;

  try {

    const user = await pool.query(
      "SELECT email FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const token = generateToken();

    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // delete old tokens
    await pool.query(
      "DELETE FROM password_reset_tokens WHERE email=$1",
      [email]
    );

    // insert new token
    await pool.query(
      `INSERT INTO password_reset_tokens(email,token,expires_at)
       VALUES($1,$2,$3)`,
      [email, token, expires]
    );

    const resetLink =
      `http://localhost:5173/reset-password/${token}`;

    // send email here
    await sendEmail(email, resetLink);

    res.json({
      message: "Password reset link sent to email"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
/* =========================
   RESET PASSWORD
========================= */

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {

    const result = await pool.query(
      "SELECT * FROM password_reset_tokens WHERE token=$1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid token"
      });
    }

    const record = result.rows[0];

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({
        message: "Token expired"
      });
    }

    const hashedPassword = hashPassword(newPassword);

    await pool.query(
      "UPDATE users SET password=$1 WHERE email=$2",
      [hashedPassword, record.email]
    );

    await pool.query(
      "DELETE FROM password_reset_tokens WHERE email=$1",
      [record.email]
    );

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

/* =========================
   EXPORTS
========================= */

module.exports = {
  createUser,
  registerStepOne,
  completeRegistration,
  loginUser,
  forgotPassword,
  resetPassword
};