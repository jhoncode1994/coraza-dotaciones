require('dotenv').config(); // Cargar variables del archivo .env

const express = require('express');
const cors = require('cors');
const db = require('./db');

const asociadosRoutes = require('./routes/asociados');
const inventarioRoutes = require('./routes/inventario');
const asignacionesRoutes = require('./routes/asignaciones');
const entregasRoutes = require('./routes/entregas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Rutas API
app.use('/api/asociados', asociadosRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/entregas', entregasRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.send('Servidor Coraza funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
