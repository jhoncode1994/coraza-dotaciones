// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear la app de Express
const app = express();

// Middleware para JSON y CORS
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor backend funcionando 🚀');
});

// Puerto desde .env o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
