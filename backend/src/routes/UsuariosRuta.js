const express = require('express');
const router = express.Router();
const userController = require('../controllers/UsuarioControlador');
const authMiddleware = require('../middleware/auth'); // Asumiendo que tienes un middleware de autenticación

// Rutas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas (ejemplo: solo admin puede ver todos los usuarios)
router.get('/', authMiddleware.isAdmin, userController.getAllUsers);

module.exports = router;
