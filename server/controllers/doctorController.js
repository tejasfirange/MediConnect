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

module.exports = { createDoctor };