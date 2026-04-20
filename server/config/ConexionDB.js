const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "techservices_hub",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);

module.exports = sequelize;