const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/ConexionDB');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'uploads' que está en la raíz del proyecto
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// También servimos específicamente la carpeta de carros para mayor seguridad
app.use('/uploads/cars', express.static(path.join(__dirname, '../uploads/cars')));

// Database connection test
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    res.status(500).json({ ok: false, database: 'disconnected', error: error.message });
  }
});

// TODO: Add your application routes here
app.use('/api/users', require('./routes/UsuariosRuta'));
app.use('/api/cars', require('./routes/CarroRutas'));
app.use('/api/categories', require('./routes/CategoriaRutas'));
app.use('/api/rentals', require('./routes/AlquilerRutas'));
app.use('/api/payments', require('./routes/PagoRutas'));
app.use('/api/stats', require('./routes/StatsRutas'));


// Global Error Handler
app.use(errorHandler);

module.exports = app;
