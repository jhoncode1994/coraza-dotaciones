// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const config = {};

if (process.env.DATABASE_URL) {
  // Si usas DATABASE_URL completa
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = { rejectUnauthorized: false };
} else {
  // Usando variables separadas (PGUSER, PGPASSWORD, etc.)
  config.user = process.env.PGUSER;
  config.password = process.env.PGPASSWORD;
  config.host = process.env.PGHOST;
  config.database = process.env.PGDATABASE;
  config.port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;
  config.ssl = (process.env.PGSSLMODE === 'require') ? { rejectUnauthorized: false } : false;
}

const pool = new Pool(config);

module.exports = pool;
