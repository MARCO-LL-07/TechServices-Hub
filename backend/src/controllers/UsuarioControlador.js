const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, password, rol } = req.body;
    const pwd = contraseña || password;
    const rolNormalizado = (rol || 'cliente').toLowerCase();
    const newUser = await Usuario.create({ nombre, correo, contraseña: pwd, rol: rolNormalizado });
    res.status(201).json({ message: "Usuario registrado con éxito", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const user = await Usuario.findOne({ where: { correo } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const payload = { id: user.id, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '1h' });

    // No enviar la contraseña en la respuesta
    const userResponse = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// Obtener todos los usuarios (protegido, solo para admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: { exclude: ['contraseña'] } // Excluir contraseña de la respuesta
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};
