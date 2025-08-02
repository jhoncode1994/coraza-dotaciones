require('dotenv').config(); // 👈 Cargar variables del archivo .env

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Coraza funcionando');
});

// ---------------- ASOCIADOS ---------------- //

// Obtener todos los asociados
app.get('/api/asociados', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM asociados ORDER BY apellidos, nombres');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener asociados:', error);
    res.status(500).json({ error: 'Error al obtener asociados' });
  }
});

// Crear nuevo asociado
app.post('/api/asociados', async (req, res) => {
  const { cedula, nombres, apellidos, fecha_ingreso } = req.body;

  try {
    await db.query(
      'INSERT INTO asociados (cedula, nombres, apellidos, fecha_ingreso) VALUES ($1, $2, $3, $4)',
      [cedula, nombres, apellidos, fecha_ingreso || null]
    );
    res.status(201).json({ mensaje: 'Asociado creado correctamente' });
  } catch (error) {
    console.error('❌ Error al crear asociado:', error);
    res.status(500).json({ error: 'Error al crear asociado' });
  }
});

// Editar asociado
app.put('/api/asociados/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const { nombres, apellidos, fecha_ingreso } = req.body;

  try {
    await db.query(
      'UPDATE asociados SET nombres = $1, apellidos = $2, fecha_ingreso = $3 WHERE cedula = $4',
      [nombres, apellidos, fecha_ingreso || null, cedula]
    );
    res.json({ mensaje: 'Asociado actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar asociado:', error);
    res.status(500).json({ error: 'Error al actualizar asociado' });
  }
});

// Eliminar asociado
app.delete('/api/asociados/:cedula', async (req, res) => {
  const { cedula } = req.params;

  try {
    await db.query('DELETE FROM asociados WHERE cedula = $1', [cedula]);
    res.json({ mensaje: 'Asociado eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar asociado:', error);
    res.status(500).json({ error: 'Error al eliminar asociado' });
  }
});

// ---------------- INVENTARIO ---------------- //

// Obtener todo el inventario
app.get('/api/inventario', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inventario ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener inventario:', error);
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
});

// Crear nuevo ítem de inventario
app.post('/api/inventario', async (req, res) => {
  const { nombre, descripcion, cantidad, categoria } = req.body;

  try {
    await db.query(
      'INSERT INTO inventario (nombre, descripcion, cantidad, categoria) VALUES ($1, $2, $3, $4)',
      [nombre, descripcion || null, cantidad || 0, categoria || null]
    );
    res.status(201).json({ mensaje: 'Ítem de inventario creado correctamente' });
  } catch (error) {
    console.error('❌ Error al crear ítem:', error);
    res.status(500).json({ error: 'Error al crear ítem' });
  }
});

// Editar ítem de inventario
app.put('/api/inventario/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, cantidad, categoria } = req.body;

  try {
    await db.query(
      'UPDATE inventario SET nombre = $1, descripcion = $2, cantidad = $3, categoria = $4 WHERE id = $5',
      [nombre, descripcion || null, cantidad || 0, categoria || null, id]
    );
    res.json({ mensaje: 'Ítem actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar ítem:', error);
    res.status(500).json({ error: 'Error al actualizar ítem' });
  }
});

// Eliminar ítem del inventario
app.delete('/api/inventario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM inventario WHERE id = $1', [id]);
    res.json({ mensaje: 'Ítem eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar ítem:', error);
    res.status(500).json({ error: 'Error al eliminar ítem' });
  }
});

// ------------------------------------------ //

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
