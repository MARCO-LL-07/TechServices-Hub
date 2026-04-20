const sequelize = require("./config/ConexionDB");
const Carro = require("./models/Carro");

async function testSoftDelete() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    // 🗑️ ELIMINAR DIRECTAMENTE (sin crear)
    const id = 1;

    await Carro.destroy({
      where: { id }
    });

    console.log(`Carro con ID ${id} eliminado (soft delete)`);

    // 🔍 verificar activos
    const activos = await Carro.findAll();
    console.log("Carros activos:", activos.length);

    // 👀 ver eliminados también
    const todos = await Carro.findAll({
      paranoid: false
    });

    console.log("Total incluyendo eliminados:", todos.length);

    // 🔎 ver deletedAt
    const eliminado = await Carro.findOne({
      where: { id },
      paranoid: false
    });

    console.log("deletedAt:", eliminado?.deletedAt);

    process.exit();

  } catch (error) {
    console.error("Error:", error);
  }
}

testSoftDelete();