const { Categoria } = require('../models/Index');

exports.getAll = async (_req, res) => {
  try {
    const categorias = await Categoria.findAll({ order: [['nombre', 'ASC']] });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorias', error: error.message });
  }
};