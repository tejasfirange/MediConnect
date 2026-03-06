const pool = require("../config/db");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => CryptoJS.SHA256(password).toString();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const isValidEmail = (value) => EMAIL_REGEX.test(String(value || "").trim().toLowerCase());
const isValidPhone = (value) => PHONE_REGEX.test(String(value || "").trim());

const createUser = async (req, res) => {
  return registerStepOne(req, res);
};

const registerStepOne = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await pool.query("SELECT email FROM users WHERE email=$1", [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
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
    res.status(500).json({ message: error.message });
  }
};

const completeRegistration = async (req, res) => {
  const client = await pool.connect();
  try {
    const { registrationToken, role, details = {} } = req.body;

    if (!registrationToken || !role) {
      return res.status(400).json({ message: "registrationToken and role are required" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({ message: "role must be either 'patient' or 'doctor'" });
    }

    const decoded = jwt.verify(registrationToken, process.env.JWT_SECRET);
    if (decoded.type !== "registration") {
      return res.status(400).json({ message: "Invalid registration token type" });
    }

    const { email, passwordHash } = decoded;
    const { name, dob, gender, contact_no, registration_no, qualification } = details;
    const trimmedContactNo = String(contact_no || "").trim();

    if (!name) {
      return res.status(400).json({ message: "details.name is required" });
    }
    if (trimmedContactNo && !isValidPhone(trimmedContactNo)) {
      return res.status(400).json({ message: "Contact number must be exactly 10 digits" });
    }

    await client.query("BEGIN");

    const existingUser = await client.query("SELECT email FROM users WHERE email=$1", [email]);
    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "User already exists with this email" });
    }

    await client.query(
      "INSERT INTO users (email, role, password) VALUES ($1, $2, $3)",
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
        `INSERT INTO doctor_details (email, name, dob, gender, contact_no, registration_no, qualification)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          email,
          name,
          dob || null,
          gender || null,
          trimmedContactNo || null,
          registration_no || null,
          qualification || null,
        ]
      );
    }

    await client.query("COMMIT");

    const authToken = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      message: "Registration completed successfully",
      user: { email, role },
      token: authToken,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Registration token expired. Restart step 1." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid registration token" });
    }
    return res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// LOGIN
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

    // check user
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

    // hash entered password
    const hashedPassword = hashPassword(password);

    if (hashedPassword !== dbUser.password) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // create token
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

module.exports = { createUser, registerStepOne, completeRegistration, loginUser };
