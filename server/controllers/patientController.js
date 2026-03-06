const pool = require("../config/db");

const registerPatient = async (req, res) => {
  try {
    const { name, dob, gender, contact_no } = req.body;
    const email = req.user?.email || req.body.email;

    if (!email || !name) {
      return res.status(400).json({ message: "email and name are required" });
    }

    const query = `
        INSERT INTO patient_details
        (email, name, dob, gender, contact_no)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
    `;

    const result = await pool.query(query, [
      email,
      name,
      dob,
      gender,
      contact_no,
    ]);

    res.json({
      message: "Patient registered successfully",
      patient: result.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const email = req.user?.email || req.query.email;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const result = await pool.query(
      "SELECT id, email, name, dob, gender, contact_no FROM patient_details WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    return res.json({ patient: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPatientHistory = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `SELECT pr_id, email, report, is_verified
       FROM patient_reports
       WHERE email=$1
       ORDER BY pr_id DESC`,
      [email]
    );

    return res.json({ reports: result.rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPatientHistoryById = async (req, res) => {
  try {
    const email = req.user?.email;
    const reportId = Number(req.params.id);

    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!Number.isInteger(reportId) || reportId <= 0) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const result = await pool.query(
      `SELECT pr_id, email, report, is_verified
       FROM patient_reports
       WHERE email=$1 AND pr_id=$2`,
      [email, reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json({ report: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePatientProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const { name, dob, gender, contact_no } = req.body;

    // Use UPSERT logic (INSERT ... ON CONFLICT)
    // Note: This assumes UNIQUE constraint on email exists. 
    // If it doesn't, we'll use a transaction with UPDATE/INSERT fallback.
    
    const query = `
      INSERT INTO patient_details (email, name, dob, gender, contact_no)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name, 
          dob = EXCLUDED.dob, 
          gender = EXCLUDED.gender, 
          contact_no = EXCLUDED.contact_no
      RETURNING *
    `;

    const result = await pool.query(query, [email, name, dob, gender, contact_no]);

    res.json({
      message: "Profile updated successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    // If ON CONFLICT fails because of missing constraint, we fallback to UPDATE/INSERT
    if (error.code === '42710' || error.message.includes('ON CONFLICT')) {
       // Manual fallback
       const updateRes = await pool.query(
         "UPDATE patient_details SET name=$1, dob=$2, gender=$3, contact_no=$4 WHERE email=$5 RETURNING *",
         [req.body.name, req.body.dob, req.body.gender, req.body.contact_no, req.user.email]
       );
       
       if (updateRes.rowCount === 0) {
         const insertRes = await pool.query(
           "INSERT INTO patient_details (email, name, dob, gender, contact_no) VALUES ($1,$2,$3,$4,$5) RETURNING *",
           [req.user.email, req.body.name, req.body.dob, req.body.gender, req.body.contact_no]
         );
         return res.json({ message: "Profile created successfully", patient: insertRes.rows[0] });
       }
       return res.json({ message: "Profile updated successfully", patient: updateRes.rows[0] });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPatient,
  getPatientProfile,
  getPatientHistory,
  getPatientHistoryById,
  updatePatientProfile,
};
