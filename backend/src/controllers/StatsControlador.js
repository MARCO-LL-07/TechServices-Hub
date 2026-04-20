const { Carro, Alquiler, Pago } = require('../models/Index');

exports.getDashboardStats = async (req, res) => {
  try {
    const total_carros = await Carro.count();
    const disponibles = await Carro.count({ where: { estado: 'disponible' } });
    const alquilados = await Carro.count({ where: { estado: 'alquilado' } });
    const mantenimiento = await Carro.count({ where: { estado: 'mantenimiento' } });

    const total_alquileres = await Alquiler.count();
    const pagos = await Pago.findAll({ where: { estado: 'pagado' }, attributes: ['monto'] });
    const ganancias = pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0);

    res.json({ total_carros, disponibles, alquilados, mantenimiento, total_alquileres, ganancias });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};
