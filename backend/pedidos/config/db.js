const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Probar la conexión
pool.connect()
    .then(() => console.log('Conexión a PostgreSQL exitosa'))
    .catch((err) => {
        console.error('Error al conectar a PostgreSQL:', err.message);
        process.exit(1);
    });

module.exports = { pool };
