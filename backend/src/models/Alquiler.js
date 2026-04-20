const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Alquiler = sequelize.define("Alquiler", {
  fecha_inicio: DataTypes.DATEONLY,
  fecha_fin: DataTypes.DATEONLY,
  total_dias: DataTypes.INTEGER,
  costo_total: {
    type: DataTypes.DECIMAL,
    field: "total_pago"
  },
  usuario_id: DataTypes.INTEGER,
  carro_id: DataTypes.INTEGER,
  estado: {
    type: DataTypes.ENUM("activo", "finalizado", "cancelado"),
    defaultValue: "activo"
  }
}, {
  tableName: "alquileres",
  timestamps: false
});

module.exports = Alquiler;