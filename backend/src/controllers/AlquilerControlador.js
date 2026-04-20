const { Alquiler, Usuario, Carro } = require('../models/Index');

exports.getAll = async (req, res) => {
	try {
		const rentals = await Alquiler.findAll({
			include: [
				{ model: Usuario, attributes: ['id', 'nombre', 'correo'] },
				{ model: Carro, attributes: ['id', 'marca', 'modelo', 'placa'] }
			],
			order: [['id', 'DESC']]
		});
		res.json(rentals);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener alquileres', error: error.message });
	}
};

exports.create = async (req, res) => {
	try {
		const { carro_id, cliente_id, usuario_id, fecha_inicio, fecha_fin, costo_total, total_pago } = req.body;
		const uid = usuario_id || cliente_id;
		const monto = costo_total || total_pago || 0;

		const rental = await Alquiler.create({
			usuario_id: uid,
			carro_id,
			fecha_inicio,
			fecha_fin,
			costo_total: monto,
			estado: 'activo'
		});

		await Carro.update({ estado: 'alquilado' }, { where: { id: carro_id } });
		res.status(201).json(rental);
	} catch (error) {
		res.status(500).json({ message: 'Error al crear alquiler', error: error.message });
	}
};

exports.updateStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { estado } = req.body;
		const rental = await Alquiler.findByPk(id);
		if (!rental) {
			return res.status(404).json({ message: 'Alquiler no encontrado' });
		}
		await rental.update({ estado });

		if (estado === 'finalizado' || estado === 'cancelado') {
			await Carro.update({ estado: 'disponible' }, { where: { id: rental.carro_id } });
		}

		res.json({ message: 'Estado de alquiler actualizado', rental });
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar estado de alquiler', error: error.message });
	}
};
