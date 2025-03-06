const express = require('express');
const envioRoutes = require('./routes/envioRoutes');
const { pool } = require('../config/db');

require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());

// Rutas
app.use('/api', envioRoutes);

// Conexión a la base de datos
pool.connect((err) => {
    if (err) {
        console.error('Error al conectar a PostgreSQL:', err.message);
    } else {
        console.log('Conexión a PostgreSQL exitosa');
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Servidor de Envío y Logística corriendo en el puerto ${PORT}`);
});
