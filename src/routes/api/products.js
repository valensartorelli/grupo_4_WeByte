const express = require('express');
const router = express.Router();
const productsAPIController = require('../../controllers/api/productsAPIController');

//Rutas
//Listado de productos
router.get('/', productsAPIController.list);
//Cantidad de productos
router.get('/count', productsAPIController.count);
//Cantidad de productos por categoria
router.get('/countByCat', productsAPIController.category);
//Detalle de un producto
router.get('/:id', productsAPIController.detail);



module.exports = router;