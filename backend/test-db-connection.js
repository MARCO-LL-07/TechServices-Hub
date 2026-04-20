require('dotenv').config();
const sequelize = require('./src/config/ConexionDB');

const testConnection = async () => {
  console.log('Iniciando prueba de conexión a la base de datos...');
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida exitosamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:');
    console.error('Error:', error.name);
    console.error('Mensaje:', error.message);
    if (error.parent) {
        console.error('Detalles del error original:', error.parent);
    }
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
};

testConnection();
