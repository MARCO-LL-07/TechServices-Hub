const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Carro = sequelize.define("Carro", {
  marca: DataTypes.STRING,
  modelo: DataTypes.STRING,
  año: DataTypes.INTEGER,
  placa: {
    type: DataTypes.STRING,
    unique: true
  },
  precio_por_dia: DataTypes.DECIMAL,
  estado: {
    type: DataTypes.ENUM("disponible", "alquilado", "mantenimiento"),
    defaultValue: "disponible"
  }
}, {
  tableName: "carros",
  timestamps: false
});

module.exports = Carro;