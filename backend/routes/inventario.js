// backend/routes/inventario.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asegúrate de que db.js exporta el pool

// ✅ POST /api/agregar-stock — Actualiza cantidad de un producto
router.post('/agregar-stock', async (req, res) => {
  const { producto_id, cantidad } = req.body;

  if (!producto_id || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const result = await pool.query(
      'UPDATE inventario SET cantidad = cantidad + $1 WHERE producto_id = $2',
      [cantidad, producto_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ mensaje: 'Stock actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✅ GET /api/inventario — Lista todos los productos
router.get('/inventario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario ORDER BY producto_id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
});

module.exports = router;