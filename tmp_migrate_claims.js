const pool = require('./server/config/db');

async function migrate() {
  const query = `
    ALTER TABLE consultations ADD COLUMN IF NOT EXISTS claimed_by VARCHAR(255);
    ALTER TABLE consultations ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP;
    UPDATE consultations SET status = 'pending' WHERE status = 'in_review';
  `;
  try {
    await pool.query(query);
    console.log('Consultations table updated with claimed columns.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating consultations table:', err);
    process.exit(1);
  }
}

migrate();
