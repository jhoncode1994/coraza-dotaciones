const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Carga variables de entorno desde .env

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite recibir JSON en las peticiones

// Rutas
const inventarioRoutes = require('./routes/inventario');
app.use('/api', inventarioRoutes);

// Rutas asociados
const asociadosRoutes = require('./routes/asociados');
app.use('/api', asociadosRoutes);

// Rutas entregas
const entregasRoutes = require('./routes/entregas');
app.use('/api', entregasRoutes);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});