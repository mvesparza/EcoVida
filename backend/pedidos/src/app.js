require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api', pedidoRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de Pedidos corriendo en el puerto ${PORT}`);
});