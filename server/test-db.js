const sequelize = require("./config/ConexionDB");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
})();