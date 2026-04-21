const express = require('express');
const router = express.Router();
const carroController = require('../controllers/CarroControlador');
const upload = require('../middleware/upload');

router.get('/', carroController.getAll);
router.post('/', upload.single('imagen'), carroController.create);
router.put('/:id', upload.single('imagen'), carroController.update);
router.delete('/:id', carroController.remove);

module.exports = router;
