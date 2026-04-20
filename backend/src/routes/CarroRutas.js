const express = require('express');
const router = express.Router();
const carroController = require('../controllers/CarroControlador');

router.get('/', carroController.getAll);
router.post('/', carroController.create);
router.put('/:id', carroController.update);
router.delete('/:id', carroController.remove);

module.exports = router;
