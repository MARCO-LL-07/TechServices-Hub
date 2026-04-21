const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Categoria = sequelize.define("Categoria", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "categorias",
  timestamps: false
});

module.exports = Categoria;