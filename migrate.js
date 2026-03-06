const pool = require('./server/config/db');

async function migrate() {
  const query = `
    CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        patient_email VARCHAR(255) NOT NULL,
        doctor_email VARCHAR(255),
        report_id INT NOT NULL,
        risk_level VARCHAR(50),
        llm_prescription TEXT,
        doctor_prescription TEXT,
        status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, edited
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_consultation_patient
            FOREIGN KEY (patient_email)
            REFERENCES users(email)
            ON DELETE CASCADE,
        CONSTRAINT fk_consultation_report
            FOREIGN KEY (report_id)
            REFERENCES patient_reports(pr_id)
            ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log('Consultations table created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating consultations table:', err);
    process.exit(1);
  }
}

migrate();
