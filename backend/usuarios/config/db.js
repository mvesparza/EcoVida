const { Pool } = require('pg');

// Configurar la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
});

console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
console.log('Tipo de POSTGRES_PASSWORD:', typeof process.env.POSTGRES_PASSWORD);

// Función para conectar a PostgreSQL
const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Conexión a PostgreSQL exitosa');
    } catch (error) {
        console.error('Error al conectar a PostgreSQL:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };
