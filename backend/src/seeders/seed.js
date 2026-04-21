require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const sequelize = require('../config/ConexionDB');
const Usuario = require('../models/Usuario');
const usuariosData = require('./usuarios.json');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    for (const userData of usuariosData) {
      const existing = await Usuario.findOne({ where: { correo: userData.correo } });
      const passwordPlano = userData.password || userData.contraseña;
      if (existing) {
        existing.nombre = userData.nombre;
        existing.rol = userData.rol;
        if (passwordPlano) {
          existing.password = passwordPlano;
        }
        await existing.save();
      } else {
        await Usuario.create({
          nombre: userData.nombre,
          correo: userData.correo,
          rol: userData.rol,
          password: passwordPlano
        });
      }
    }

    console.log('Usuarios insertados correctamente.');

  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
};

seedDatabase();
