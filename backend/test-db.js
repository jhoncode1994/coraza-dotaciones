// backend/test-db.js
const pool = require('./db');

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa ✅');
    console.log('Hora en el servidor:', result.rows[0].now);
  } catch (error) {
    console.error('Error de conexión ❌', error);
  } finally {
    pool.end();
  }
})();
