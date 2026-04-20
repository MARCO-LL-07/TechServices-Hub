const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");

const Pago = sequelize.define("Pago", {
  monto: DataTypes.DECIMAL,
  metodo_pago: {
    type: DataTypes.ENUM("efectivo", "tarjeta", "transferencia")
  },
  estado: {
    type: DataTypes.ENUM("pagado", "pendiente", "fallido"),
    defaultValue: "pendiente"
  }
}, {
  tableName: "pagos",
  timestamps: false
});

module.exports = Pago;