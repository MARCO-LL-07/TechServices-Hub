const { DataTypes } = require("sequelize");
const sequelize = require("../config/ConexionDB");
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define("Usuario", {
  nombre: DataTypes.STRING,
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM("admin", "cliente"),
    defaultValue: "cliente"
  }
}, {
  tableName: "usuarios",
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    }
  }
});

// Método para comparar contraseñas
Usuario.prototype.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = Usuario;