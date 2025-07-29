const { Pool } = require('pg');

console.log('🔗 Conectando a DB con:', process.env.DATABASE_URL); // 👈

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
