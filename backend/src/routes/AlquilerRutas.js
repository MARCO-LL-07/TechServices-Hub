const express = require('express');
const router = express.Router();
const alquilerController = require('../controllers/AlquilerControlador');

router.get('/', alquilerController.getAll);
router.post('/', alquilerController.create);
router.put('/:id/status', alquilerController.updateStatus);

module.exports = router;
