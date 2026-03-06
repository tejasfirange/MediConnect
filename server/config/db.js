const { Pool } = require('pg');

const useSsl = String(process.env.DB_SSL || 'false').toLowerCase() === 'true';

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'mediconnect',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'root',
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });

module.exports = pool;
