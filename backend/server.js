// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importa la conexión a la base de datos

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando ✅');
});

// Ruta para probar conexión a DB
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'Conexión exitosa ✅',
      serverTime: result.rows[0].now
    });
  } catch (err) {
    console.error('Error al conectar con la DB ❌', err);
    res.status(500).json({ error: 'Error al conectar con la DB' });
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} 🚀`);
});
