const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta para asignar ítems a un asociado y descontar del inventario
router.post('/', async (req, res) => {
  const { cedula_asociado, id_inventario, cantidad } = req.body;

  try {
    // 1. Verificar si hay suficiente inventario
    const result = await db.query('SELECT cantidad FROM inventario WHERE id = $1', [id_inventario]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado en inventario.' });
    }

    const disponible = result.rows[0].cantidad;

    if (disponible < cantidad) {
      return res.status(400).json({ error: 'No hay suficiente cantidad en inventario.' });
    }

    // 2. Insertar la asignación
    await db.query(
      'INSERT INTO asignaciones (cedula_asociado, id_inventario, cantidad) VALUES ($1, $2, $3)',
      [cedula_asociado, id_inventario, cantidad]
    );

    // 3. Descontar del inventario
    await db.query(
      'UPDATE inventario SET cantidad = cantidad - $1 WHERE id = $2',
      [cantidad, id_inventario]
    );

    res.status(201).json({ message: 'Asignación registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar asignación:', error);
    res.status(500).json({ error: 'Error al registrar la asignación.' });
  }
});

module.exports = router;
