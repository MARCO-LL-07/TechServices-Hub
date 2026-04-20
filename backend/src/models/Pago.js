const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Pago = sequelize.define("Pago", {
  alquiler_id: DataTypes.INTEGER,
  monto: DataTypes.DECIMAL,
  metodo_pago: {
    type: DataTypes.ENUM("efectivo", "tarjeta", "transferencia")
  },
  estado: {
    type: DataTypes.ENUM("pagado", "pendiente", "fallido"),
    defaultValue: "pendiente"
  },
  fecha_pago: DataTypes.DATE
}, {
  tableName: "pagos",
  timestamps: false
});

module.exports = Pago;