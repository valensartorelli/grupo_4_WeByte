const express = require('express');
const router = express.Router();
const brandsAPIController = require('../../controllers/api/brandsAPIController');

//Rutas
//Listado de marcas
router.get('/', brandsAPIController.list);
//Cantidad de marcas
router.get('/count', brandsAPIController.count);
//Detalle de una marca
router.get('/:id', brandsAPIController.detail);



module.exports = router;