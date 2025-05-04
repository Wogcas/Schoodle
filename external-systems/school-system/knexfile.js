// knexfile.js (en la raíz de tu proyecto)
require('dotenv').config(); // Para usar variables de entorno

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'school_system',
      port: process.env.DB_PORT || 3306,
    },
    migrations: {
      directory: './src/database/migrations', // Ruta personalizada
      tableName: 'knex_migrations', // Tabla de control de migraciones
    },
    seeds: {
      directory: './src/database/seeds', // Opcional: para datos de prueba
    },
    pool: { min: 2, max: 10 },
  },

  // Configuraciones para staging/production (similares pero con variables de entorno)
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/database/migrations',
    },
  },
};