const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Carro = sequelize.define(
  "Carro",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },

    modelo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    anio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    placa: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    precio_por_dia: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    estado: {
      type: DataTypes.ENUM("disponible", "alquilado", "mantenimiento"),
      defaultValue: "disponible"
    },

    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "carros",
    timestamps: true,
    paranoid: true
  }
);

module.exports = Carro;