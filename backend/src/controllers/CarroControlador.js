const { Carro } = require('../models/Index');

exports.getAll = async (req, res) => {
	try {
		const carros = await Carro.findAll({ order: [['id', 'DESC']] });
		res.json(carros);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener carros', error: error.message });
	}
};

exports.create = async (req, res) => {
	try {
		const carro = await Carro.create(req.body);
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
		await carro.update(req.body);
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
