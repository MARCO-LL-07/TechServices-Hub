const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Carro = sequelize.define("Carro", {
  marca: DataTypes.STRING,
  modelo: DataTypes.STRING,
  año: {
    type: DataTypes.INTEGER,
    field: "anio"
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  placa: {
    type: DataTypes.STRING,
    unique: true
  },
  precio_por_dia: DataTypes.DECIMAL,
  imagen_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM("disponible", "alquilado", "mantenimiento"),
    defaultValue: "disponible"
  }
}, {
  tableName: "carros",
  timestamps: false
});

module.exports = Carro;