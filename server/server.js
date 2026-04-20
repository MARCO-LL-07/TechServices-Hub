const app = require("./app");
const sequelize = require("./config/db");

require("./models/Index");

const PORT = 3000;

sequelize.sync()
  .then(() => {
    console.log("Base de datos conectada");
    app.listen(PORT, () => {
      console.log("Servidor en puerto " + PORT);
    });
  });