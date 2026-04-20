const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Usuario = sequelize.define("Usuario", {
  nombre: DataTypes.STRING,
  correo: {
    type: DataTypes.STRING,
    unique: true
  },
  contraseña: DataTypes.STRING,
  rol: {
    type: DataTypes.ENUM("admin", "cliente"),
    defaultValue: "cliente"
  }
}, {
  tableName: "usuarios",
  timestamps: false
});

module.exports = Usuario;