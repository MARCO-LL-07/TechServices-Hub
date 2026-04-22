const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const sequelize = require('./src/config/ConexionDB');

const testConnection = async () => {
  console.log('Iniciando prueba de conexión a la base de datos...');

  const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error('Faltan variables de entorno requeridas:', missingVars.join(', '));
    process.exitCode = 1;
    return;
  }

  try {
    await sequelize.authenticate();
    await sequelize.query('SELECT 1 AS connection_ok');
    console.log('✅ Conexión a la base de datos establecida exitosamente.');

    // Verificar si las tablas principales existen
    const [results] = await sequelize.query("SELECT * FROM \"carros\" LIMIT 1");
    console.log('Datos en tabla carros:', results);
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:');
    console.error('Error:', error.name);
    console.error('Mensaje:', error.message);
    if (error.parent) {
        console.error('Detalles del error original:', error.parent);
    }
    process.exitCode = 1;
  } finally {
    try {
      await sequelize.close();
      console.log('Conexión cerrada.');
    } catch (closeError) {
      console.error('No se pudo cerrar la conexión limpiamente:', closeError.message);
    }
  }
};

testConnection();
