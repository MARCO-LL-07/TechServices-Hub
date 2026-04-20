const Usuario = require("./Usuario");
const Carro = require("./carro");
const Alquiler = require("./Alquiler");
const Pago = require("./Pago");

// Relaciones
Usuario.hasMany(Alquiler, { foreignKey: "usuario_id" });
Alquiler.belongsTo(Usuario, { foreignKey: "usuario_id" });

Carro.hasMany(Alquiler, { foreignKey: "carro_id" });
Alquiler.belongsTo(Carro, { foreignKey: "carro_id" });

Alquiler.hasOne(Pago, { foreignKey: "alquiler_id" });
Pago.belongsTo(Alquiler, { foreignKey: "alquiler_id" });

module.exports = {
  Usuario,
  Carro,
  Alquiler,
  Pago
};