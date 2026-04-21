require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Database connection test
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
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
