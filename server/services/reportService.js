const pool = require('../config/db');

async function savePatientReport(email, report) {
  const query = `
    INSERT INTO patient_reports (email, report, is_verified)
    VALUES ($1, $2::jsonb, FALSE)
    RETURNING pr_id, email, is_verified
  `;

  const result = await pool.query(query, [email, JSON.stringify(report)]);
  return result.rows[0];
}

module.exports = {
  savePatientReport,
};
