require('dotenv').config(); // 👈 Cargar variables del archivo .env

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Compatible con Render o local

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Coraza funcionando');
});

// ---------------- ASOCIADOS ---------------- //

// Obtener todos los asociados (ordenados por apellidos y nombres)
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

  console.log('📥 Datos recibidos en POST /api/asociados:', req.body);

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

// Editar asociado existente
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
    const result = await db.query('SELECT * FROM inventario ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener inventario:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Agregar nuevo ítem al inventario
app.post('/api/inventario', async (req, res) => {
  const { nombre, descripcion, cantidad, fecha_ingreso } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO inventario (nombre, descripcion, cantidad, fecha_ingreso) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, cantidad, fecha_ingreso || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error al agregar inventario:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Editar ítem de inventario
app.put('/api/inventario/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, cantidad, fecha_ingreso } = req.body;
  try {
    const result = await db.query(
      'UPDATE inventario SET nombre=$1, descripcion=$2, cantidad=$3, fecha_ingreso=$4 WHERE id=$5 RETURNING *',
      [nombre, descripcion, cantidad, fecha_ingreso || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error al actualizar inventario:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar ítem del inventario
app.delete('/api/inventario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM inventario WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al eliminar inventario:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ------------------------------------------ //

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
