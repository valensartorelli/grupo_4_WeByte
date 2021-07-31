const express = require('express');
const router = express.Router();
const productsAPIController = require('../../controllers/api/productsAPIController');

//Rutas
//Listado de productos
router.get('/', productsAPIController.list);
//Cantidad de productos
router.get('/count', productsAPIController.count);
//ultimo producto
router.get('/latest', productsAPIController.latest);
//Detalle de un producto
router.get('/:id', productsAPIController.detail);



module.exports = router;