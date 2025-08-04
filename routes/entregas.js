const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta para registrar una entrega de dotación
router.post('/', async (req, res) => {
  const { cedula, item_id, cantidad, fecha_entrega } = req.body;

  if (!cedula || !item_id || !cantidad || !fecha_entrega) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const result = await db.query(
      `INSERT INTO entregas (cedula, item_id, cantidad, fecha_entrega)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [cedula, item_id, cantidad, fecha_entrega]
    );

    res.status(201).json({ message: 'Entrega registrada', entrega: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar entrega:', error);
    res.status(500).json({ error: 'Error al registrar entrega' });
  }
});

module.exports = router;
