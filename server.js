// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// RUTAS ============================

// === 1. ASOCIADOS ===
app.get('/api/asociados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM asociados');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/asociados', async (req, res) => {
  const { cedula, nombre, telefono, fecha_ingreso } = req.body;
  try {
    await pool.query(
      'INSERT INTO asociados (cedula, nombre, telefono, fecha_ingreso) VALUES ($1, $2, $3, $4)',
      [cedula, nombre, telefono, fecha_ingreso]
    );
    res.status(201).json({ mensaje: 'Asociado creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/asociados/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const { nombre, telefono, fecha_ingreso } = req.body;
  try {
    await pool.query(
      'UPDATE asociados SET nombre=$1, telefono=$2, fecha_ingreso=$3 WHERE cedula=$4',
      [nombre, telefono, fecha_ingreso, cedula]
    );
    res.json({ mensaje: 'Asociado actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/asociados/:cedula', async (req, res) => {
  const { cedula } = req.params;
  try {
    await pool.query('DELETE FROM asociados WHERE cedula = $1', [cedula]);
    res.json({ mensaje: 'Asociado eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === 2. INVENTARIO ===
app.get('/api/inventario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventario', async (req, res) => {
  const { item, cantidad } = req.body;
  try {
    const existente = await pool.query('SELECT * FROM inventario WHERE item = $1', [item]);
    if (existente.rows.length > 0) {
      await pool.query('UPDATE inventario SET cantidad = cantidad + $1 WHERE item = $2', [cantidad, item]);
    } else {
      await pool.query('INSERT INTO inventario (item, cantidad) VALUES ($1, $2)', [item, cantidad]);
    }
    res.status(201).json({ mensaje: 'Inventario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === 3. INGRESOS (registro de dotación ingresada a bodega) ===
app.post('/api/ingresos', async (req, res) => {
  const { fecha, datos } = req.body; // datos = array de { item, cantidad }

  try {
    for (const entrada of datos) {
      const { item, cantidad } = entrada;

      await pool.query(
        'INSERT INTO ingresos (fecha, item, cantidad) VALUES ($1, $2, $3)',
        [fecha, item, cantidad]
      );

      const existe = await pool.query('SELECT * FROM inventario WHERE item = $1', [item]);
      if (existe.rows.length > 0) {
        await pool.query('UPDATE inventario SET cantidad = cantidad + $1 WHERE item = $2', [cantidad, item]);
      } else {
        await pool.query('INSERT INTO inventario (item, cantidad) VALUES ($1, $2)', [item, cantidad]);
      }
    }

    res.status(201).json({ mensaje: 'Ingreso registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === 4. ENTREGAS (asignación de dotación a asociados) ===
app.post('/api/entregas', async (req, res) => {
  const { cedula, fecha, dotacion } = req.body; // dotacion = array de { item, cantidad }

  try {
    for (const entrega of dotacion) {
      const { item, cantidad } = entrega;

      await pool.query(
        'INSERT INTO entregas (cedula, fecha, item, cantidad) VALUES ($1, $2, $3, $4)',
        [cedula, fecha, item, cantidad]
      );

      await pool.query(
        'UPDATE inventario SET cantidad = cantidad - $1 WHERE item = $2',
        [cantidad, item]
      );
    }

    res.status(201).json({ mensaje: 'Entrega registrada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/entregas/:cedula', async (req, res) => {
  const { cedula } = req.params;
  try {
    const result = await pool.query('SELECT * FROM entregas WHERE cedula = $1 ORDER BY fecha DESC', [cedula]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
