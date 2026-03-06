const pool = require("../config/db");

const createDoctor = async (req, res) => {

  try {

    const email = req.user.email;   // email from JWT

    const {
      name,
      dob,
      gender,
      contact_no,
      registration_no,
      qualification
    } = req.body;

    const query = `
      INSERT INTO doctor_details
      (email, name, dob, gender, contact_no, registration_no, qualification)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      email,
      name,
      dob,
      gender,
      contact_no,
      registration_no,
      qualification
    ]);

    res.json({
      message: "Doctor created successfully",
      doctor: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const getDoctorProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const result = await pool.query(
      "SELECT * FROM doctor_details WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    return res.json({ doctor: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const { name, dob, gender, contact_no, registration_no, qualification } = req.body;

    const query = `
      INSERT INTO doctor_details 
      (email, name, dob, gender, contact_no, registration_no, qualification)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          dob = EXCLUDED.dob,
          gender = EXCLUDED.gender,
          contact_no = EXCLUDED.contact_no,
          registration_no = EXCLUDED.registration_no,
          qualification = EXCLUDED.qualification
      RETURNING *
    `;

    const result = await pool.query(query, [
      email,
      name,
      dob,
      gender,
      contact_no,
      registration_no,
      qualification,
    ]);

    res.json({
      message: "Profile updated successfully",
      doctor: result.rows[0],
    });
  } catch (error) {
    // Fallback if ON CONFLICT fails
    if (error.code === '42710' || error.message.includes('ON CONFLICT')) {
      const updateRes = await pool.query(
        `UPDATE doctor_details 
         SET name=$1, dob=$2, gender=$3, contact_no=$4, registration_no=$5, qualification=$6 
         WHERE email=$7 RETURNING *`,
        [req.body.name, req.body.dob, req.body.gender, req.body.contact_no, req.body.registration_no, req.body.qualification, req.user.email]
      );

      if (updateRes.rowCount === 0) {
        const insertRes = await pool.query(
          `INSERT INTO doctor_details (email, name, dob, gender, contact_no, registration_no, qualification)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
          [req.user.email, req.body.name, req.body.dob, req.body.gender, req.body.contact_no, req.body.registration_no, req.body.qualification]
        );
        return res.json({ message: "Profile created successfully", doctor: insertRes.rows[0] });
      }
      return res.json({ message: "Profile updated successfully", doctor: updateRes.rows[0] });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDoctor, getDoctorProfile, updateDoctorProfile };
