// backend/routes/entregas.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ POST /api/registrar-entrega — Registra una entrega con validación de stock
router.post('/registrar-entrega', async (req, res) => {
  const { asociado_id, producto_id, cantidad } = req.body;

  if (!asociado_id || !producto_id || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Verificar stock disponible
    const stockResult = await pool.query(
      'SELECT cantidad FROM inventario WHERE producto_id = $1',
      [producto_id]
    );

    if (stockResult.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado en inventario' });
    }

    const stockDisponible = stockResult.rows[0].cantidad;
    if (stockDisponible < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente para realizar la entrega' });
    }

    // Insertar entrega
    const entrega = await pool.query(
      'INSERT INTO entregas (asociado_id, producto_id, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [asociado_id, producto_id, cantidad]
    );

    // Actualizar inventario
    await pool.query(
      'UPDATE inventario SET cantidad = cantidad - $1 WHERE producto_id = $2',
      [cantidad, producto_id]
    );

    res.status(201).json({
      mensaje: 'Entrega registrada exitosamente',
      entrega: entrega.rows[0],
    });
  } catch (error) {
    console.error('Error al registrar entrega:', error);
    res.status(500).json({ error: 'Error al registrar entrega' });
  }
});

// ✅ GET /api/entregas — Lista todas las entregas
router.get('/entregas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM entregas ORDER BY entrega_id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener entregas:', error);
    res.status(500).json({ error: 'Error al obtener entregas' });
  }
});
// ✅ GET /api/entregas/asociado/:id — Entregas por asociado
router.get('/entregas/asociado/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM entregas WHERE asociado_id = $1 ORDER BY entrega_id DESC',
      [id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener entregas por asociado:', error);
    res.status(500).json({ error: 'Error al obtener entregas por asociado' });
  }
});

// ✅ GET /api/entregas/producto/:id — Entregas por producto
router.get('/entregas/producto/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM entregas WHERE producto_id = $1 ORDER BY entrega_id DESC',
      [id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener entregas por producto:', error);
    res.status(500).json({ error: 'Error al obtener entregas por producto' });
  }
});


module.exports = router;