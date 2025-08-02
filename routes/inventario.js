const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - listar inventario
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inventario ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener inventario:', err);
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
});

// POST - agregar ítem
router.post('/', async (req, res) => {
  const { tipo, descripcion, estado } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO inventario (tipo, descripcion, estado) VALUES ($1, $2, $3) RETURNING *',
      [tipo, descripcion, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al agregar ítem:', err);
    res.status(500).json({ error: 'Error al agregar ítem' });
  }
});

// PUT - actualizar ítem
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tipo, descripcion, estado } = req.body;
  try {
    const result = await db.query(
      'UPDATE inventario SET tipo = $1, descripcion = $2, estado = $3 WHERE id = $4 RETURNING *',
      [tipo, descripcion, estado, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Ítem no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar ítem:', err);
    res.status(500).json({ error: 'Error al actualizar ítem' });
  }
});

// DELETE - eliminar ítem
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM inventario WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Ítem no encontrado' });
    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar ítem:', err);
    res.status(500).json({ error: 'Error al eliminar ítem' });
  }
});

module.exports = router;
