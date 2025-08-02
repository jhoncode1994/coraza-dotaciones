const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los asociados
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM asociados');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener asociados:', error);
    res.status(500).json({ error: 'Error al obtener los asociados.' });
  }
});

// Crear un nuevo asociado
router.post('/', async (req, res) => {
  const { cedula, nombre, cargo, fecha_ingreso } = req.body;

  try {
    await db.query(
      'INSERT INTO asociados (cedula, nombre, cargo, fecha_ingreso) VALUES ($1, $2, $3, $4)',
      [cedula, nombre, cargo, fecha_ingreso]
    );
    res.status(201).json({ message: 'Asociado creado correctamente.' });
  } catch (error) {
    console.error('Error al crear asociado:', error);
    res.status(500).json({ error: 'Error al crear el asociado.' });
  }
});

// Actualizar un asociado
router.put('/:cedula', async (req, res) => {
  const cedula = req.params.cedula;
  const { nombre, cargo, fecha_ingreso } = req.body;

  try {
    await db.query(
      'UPDATE asociados SET nombre = $1, cargo = $2, fecha_ingreso = $3 WHERE cedula = $4',
      [nombre, cargo, fecha_ingreso, cedula]
    );
    res.json({ message: 'Asociado actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar asociado:', error);
    res.status(500).json({ error: 'Error al actualizar el asociado.' });
  }
});

// Eliminar un asociado
router.delete('/:cedula', async (req, res) => {
  const cedula = req.params.cedula;

  try {
    await db.query('DELETE FROM asociados WHERE cedula = $1', [cedula]);
    res.json({ message: 'Asociado eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar asociado:', error);
    res.status(500).json({ error: 'Error al eliminar el asociado.' });
  }
});

module.exports = router;
