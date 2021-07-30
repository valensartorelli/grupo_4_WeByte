const express = require('express');
const router = express.Router();
const usersAPIController = require('../../controllers/api/usersAPIController');

//Rutas
//Listado de usuarios
router.get('/', usersAPIController.list);
//Cantidad de usuarios
router.get('/count', usersAPIController.count);
//Detalle de una usuario
router.get('/:id', usersAPIController.detail);



module.exports = router;