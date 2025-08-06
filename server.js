require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Conexión a PostgreSQL usando DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Asegúrate de que HTML y JS estén en /public

// Verificación de conexión
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
  } else {
    console.log('✅ Conexión exitosa. Hora actual en PostgreSQL:', result.rows[0].now);
  }
});

// Endpoint para registrar asociado
app.post('/api/asociados', async (req, res) => {
  const { cedula, nombres, apellidos, zona, fecha_ingreso } = req.body;

  if (!cedula || !nombres || !apellidos) {
    return res.status(400).json({ error: 'Cédula, nombres y apellidos son obligatorios' });
  }

  try {
    await pool.query(
      `INSERT INTO asociados (cedula, nombres, apellidos, zona, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (cedula) DO UPDATE SET
         nombres = EXCLUDED.nombres,
         apellidos = EXCLUDED.apellidos,
         zona = EXCLUDED.zona,
         fecha_ingreso = EXCLUDED.fecha_ingreso`,
      [cedula, nombres, apellidos, zona, fecha_ingreso]
    );

    res.status(201).json({ mensaje: 'Asociado registrado correctamente' });
  } catch (err) {
    console.error('Error en POST /api/asociados:', err);
    res.status(500).json({ error: 'Error al registrar asociado' });
  }
});
// Verificación de conexión
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
  } else {
    console.log('✅ Conexión exitosa. Hora actual en PostgreSQL:', result.rows[0].now);
  }
});
// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});