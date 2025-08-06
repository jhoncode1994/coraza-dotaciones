require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// 🔗 Conexión a PostgreSQL usando DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🛠️ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Asegúrate de que HTML y JS estén en /public

// ✅ Verificación de conexión inicial
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
  } else {
    console.log('✅ Conexión exitosa. Hora actual en PostgreSQL:', result.rows[0].now);
  }
});

// 📥 Endpoint para registrar o actualizar asociado
app.post('/api/asociados', async (req, res) => {
  const { cedula, nombres, apellidos, zona, fecha_ingreso } = req.body;

  // Validación básica
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
      [cedula, nombres, apellidos, zona || null, fecha_ingreso || null]
    );

    res.status(201).json({ mensaje: 'Asociado registrado correctamente' });
  } catch (err) {
    console.error('❌ Error en POST /api/asociados:', err);
    res.status(500).json({ error: 'Error al registrar asociado' });
  }
});

// 📤 Endpoint para obtener lista de asociados
app.get('/api/asociados', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM asociados LIMIT 10');
    res.status(200).json(resultado.rows);
  } catch (err) {
    console.error('❌ Error en GET /api/asociados:', err);
    res.status(500).json({ error: 'Error al obtener asociados' });
  }
});

// 🛡️ Middleware global para errores inesperados
app.use((err, req, res, next) => {
  console.error('❌ Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});