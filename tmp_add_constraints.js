const pool = require('./server/config/db');

async function addConstraints() {
  try {
    console.log('Adding UNIQUE constraints to email columns...');
    
    // Check and add for patient_details
    await pool.query('ALTER TABLE patient_details ADD CONSTRAINT unique_patient_email UNIQUE (email)');
    console.log('Added unique_patient_email constraint.');
    
    // Check and add for doctor_details
    await pool.query('ALTER TABLE doctor_details ADD CONSTRAINT unique_doctor_email UNIQUE (email)');
    console.log('Added unique_doctor_email constraint.');
    
    process.exit(0);
  } catch (err) {
    if (err.code === '42710') {
      console.log('Constraint already exists. Skipping...');
      process.exit(0);
    }
    console.error('Error adding constraints:', err);
    process.exit(1);
  }
}

addConstraints();
