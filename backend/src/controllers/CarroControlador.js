const { Op } = require('sequelize');
const { Carro, Categoria } = require('../models/Index');

const buildCarPayload = (req) => {
  const body = { ...req.body };

  if (body.anio && !body.año) {
    body.año = body.anio;
  }

  if (req.file) {
    body.imagen_url = `/uploads/cars/${req.file.filename}`;
  }

  delete body.anio;
  return body;
};

exports.getAll = async (req, res) => {
	try {
		const { search = '', categoria = '' } = req.query;
		const where = {};

		if (search) {
			where[Op.or] = [
				{ marca: { [Op.iLike]: `%${String(search)}%` } },
				{ modelo: { [Op.iLike]: `%${String(search)}%` } }
			];
		}

		if (categoria) {
			where.categoria_id = Number(categoria);
		}

		const carros = await Carro.findAll({
			where,
			include: [{ model: Categoria, attributes: ['id', 'nombre'], required: false }],
			order: [['id', 'DESC']]
		});
		res.json(carros);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener carros', error: error.message });
	}
};

exports.create = async (req, res) => {
	try {
		const payload = buildCarPayload(req);
		const carro = await Carro.create(payload);
		res.status(201).json(carro);
	} catch (error) {
		res.status(500).json({ message: 'Error al crear carro', error: error.message });
	}
};

exports.update = async (req, res) => {
	try {
		const { id } = req.params;
		const carro = await Carro.findByPk(id);
		if (!carro) {
			return res.status(404).json({ message: 'Carro no encontrado' });
		}
		const payload = buildCarPayload(req);
		await carro.update(payload);
		res.json(carro);
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar carro', error: error.message });
	}
};

exports.remove = async (req, res) => {
	try {
		const { id } = req.params;
		const carro = await Carro.findByPk(id);
		if (!carro) {
			return res.status(404).json({ message: 'Carro no encontrado' });
		}
		await carro.destroy();
		res.json({ message: 'Carro eliminado con éxito' });
	} catch (error) {
		res.status(500).json({ message: 'Error al eliminar carro', error: error.message });
	}
};
