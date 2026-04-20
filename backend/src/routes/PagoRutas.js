const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/PagoControlador');

router.get('/', pagoController.getAll);
router.put('/:id/status', pagoController.updateStatus);

module.exports = router;
