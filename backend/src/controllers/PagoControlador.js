const { Pago } = require('../models/Index');

exports.getAll = async (req, res) => {
	try {
		const payments = await Pago.findAll({ order: [['id', 'DESC']] });
		res.json(payments);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
	}
};

exports.updateStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { estado } = req.body;
		const payment = await Pago.findByPk(id);
		if (!payment) {
			return res.status(404).json({ message: 'Pago no encontrado' });
		}

		await payment.update({ estado });
		res.json({ message: 'Estado de pago actualizado', payment });
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar pago', error: error.message });
	}
};
