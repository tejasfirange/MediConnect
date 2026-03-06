const pool = require('../config/db');

async function runMigration() {
  const query = `
    -- 1. Users Table
    CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        role VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    -- 2. Patient Details Table
    CREATE TABLE IF NOT EXISTS patient_details (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        name VARCHAR(100) NOT NULL,
        dob DATE,
        gender VARCHAR(10),
        contact_no VARCHAR(15),
        
        CONSTRAINT fk_patient_email
            FOREIGN KEY (email)
            REFERENCES users(email)
            ON DELETE CASCADE
    );

    -- 3. Doctor Details Table
    CREATE TABLE IF NOT EXISTS doctor_details (
        d_id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        name VARCHAR(100) NOT NULL,
        dob DATE,
        gender VARCHAR(10),
        contact_no VARCHAR(15),
        registration_no VARCHAR(100) UNIQUE,
        qualification VARCHAR(100),

        CONSTRAINT fk_doctor_email
            FOREIGN KEY (email)
            REFERENCES users(email)
            ON DELETE CASCADE
    );

    -- 4. Patient Reports Table
    CREATE TABLE IF NOT EXISTS patient_reports (
        pr_id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        report JSONB,
        is_verified BOOLEAN DEFAULT FALSE,

        CONSTRAINT fk_report_email
            FOREIGN KEY (email)
            REFERENCES users(email)
            ON DELETE CASCADE
    );

    -- 5. Password Reset Tokens Table
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT fk_reset_email
        FOREIGN KEY (email)
        REFERENCES users(email)
        ON DELETE CASCADE
    );

    -- 6. Consultations Table
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

    -- 7. Add columns if missing to consultations
    DO $$ 
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='consultations' AND column_name='claimed_by') THEN
            ALTER TABLE consultations ADD COLUMN claimed_by VARCHAR(255);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='consultations' AND column_name='claimed_at') THEN
            ALTER TABLE consultations ADD COLUMN claimed_at TIMESTAMP;
        END IF;
    END $$;

    -- 8. Clean up statuses
    UPDATE consultations SET status = 'pending' WHERE status = 'in_review';
  `;

  try {
    await pool.query(query);
    console.log('Database migration completed successfully.');
  } catch (err) {
    console.error('Database migration failed:', err.message);
    // Don't exit here to allow server to potentially start
  }
}

module.exports = { runMigration };
