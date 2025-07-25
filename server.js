const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Coraza funcionando');
});

// ---------------- ASOCIADOS ---------------- //


// Obtener todos los asociados (ordenados por nombre)
app.get('/api/asociados', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM asociados ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener asociados:', error);
    res.status(500).json({ error: 'Error al obtener asociados' });
  }
});

// Crear nuevo asociado
app.post('/api/asociados', async (req, res) => {
  const { cedula, nombre, fecha_ingreso } = req.body;

  console.log('📥 Datos recibidos en POST /api/asociados:', req.body);

  try {
    await db.query(
      'INSERT INTO asociados (cedula, nombre, fecha_ingreso) VALUES ($1, $2, $3)',
      [cedula, nombre, fecha_ingreso || null]
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
  const { nombre, fecha_ingreso } = req.body;

  try {
    await db.query(
      'UPDATE asociados SET nombre = $1, fecha_ingreso = $2 WHERE cedula = $3',
      [nombre, fecha_ingreso || null, cedula]
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

// ------------------------------------------ //

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
