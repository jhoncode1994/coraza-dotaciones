// backend/routes/asociados.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ GET /api/asociados — Lista todos los asociados
router.get('/asociados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM asociados ORDER BY asociado_id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener asociados:', error);
    res.status(500).json({ error: 'Error al obtener asociados' });
  }
});

// ✅ POST /api/registrar-asociado — Agrega un nuevo asociado
router.post('/registrar-asociado', async (req, res) => {
  const { nombre, documento, telefono } = req.body;

  if (!nombre || !documento || !telefono) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO asociados (nombre, documento, telefono) VALUES ($1, $2, $3) RETURNING *',
      [nombre, documento, telefono]
    );

    res.status(201).json({
      mensaje: 'Asociado registrado exitosamente',
      asociado: result.rows[0],
    });
  } catch (error) {
    console.error('Error al registrar asociado:', error);
    res.status(500).json({ error: 'Error al registrar asociado' });
  }
});

module.exports = router;