const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Alquiler = sequelize.define("Alquiler", {
  fecha_inicio: DataTypes.DATE,
  fecha_fin: DataTypes.DATE,
  total_dias: DataTypes.INTEGER,
  total_pago: DataTypes.DECIMAL,
  estado: {
    type: DataTypes.ENUM("activo", "finalizado", "cancelado"),
    defaultValue: "activo"
  }
}, {
  tableName: "alquileres",
  timestamps: false
});

module.exports = Alquiler;