const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/CategoriaControlador');

router.get('/', categoriaController.getAll);

module.exports = router;