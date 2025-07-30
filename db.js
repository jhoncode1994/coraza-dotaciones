const { Pool } = require('pg');
require('dotenv').config();

console.log('🔗 Conectando con:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
