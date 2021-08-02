const express = require('express');
const router = express.Router();
const categoriesAPIController = require('../../controllers/api/categoriesAPIController');

//Rutas
//Listado de marcas
router.get('/', categoriesAPIController.list);
//Cantidad de marcas
router.get('/count', categoriesAPIController.count);
//Detalle de una marca
router.get('/:id', categoriesAPIController.detail);



module.exports = router;