require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Importar rutas de categorías

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api', productRoutes);
app.use('/api', categoryRoutes); // Rutas de categorías

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de Catálogo de Productos corriendo en el puerto ${PORT}`);
});
