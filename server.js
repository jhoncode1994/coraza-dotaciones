require('dotenv').config(); // Cargar variables del archivo .env

const express = require('express');
const cors = require('cors');
const db = require('./db');

// Importar rutas
const asociadosRoutes = require('./routes/asociados');
const inventarioRoutes = require('./routes/inventario');
const asignacionesRoutes = require('./routes/asignaciones');
const entregasRoutes = require('./routes/entregas'); // ✅ NUEVA RUTA AGREGADA

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Coraza funcionando');
});

// Rutas API
app.use('/api/asociados', asociadosRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/entregas', entregasRoutes); // ✅ NUEVA RUTA MONTADA

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
