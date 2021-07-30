const path = require('path');
let db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');

//Aqui tienen otra forma de llamar a cada uno de los modelos
const User = db.User;
const Rol = db.Rol;


//const { User, Address } = require('../database/models');

const usersAPIController = {

    list: (req, res) => {
        User.findAll()
        .then(users => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: users.length,
                    url: 'api/users'
                },
                data: users
            }
            res.json(respuesta);
        })
        .catch( err => {
            res.send({ err: 'Not found' });
        });
    },
    detail: (req, res) =>{
        console.log('entre a la api de detalle de usuario')
        console.log('----------------------------')
        let userId = req.params.id;
        User.findByPk(userId,
            {
                include : ['rol']
            })
            .then(user => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: user.length,
                        url: '/api/users/:id'
                    },
                    data: user
                }
                res.json(respuesta);
            })
            .catch( err => {
                res.send({ err: 'Not found' });
            });
    },
    
    count: (req, res) =>{
        User.findAll()
        .then(users => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: users.length,
                    url: 'api/users/count'
                },
                data: users
            }
            res.json("El total de usuarios es " + respuesta.meta.total);
        })
        .catch( err => {
            res.send({ err: 'Not found' });
        });
    }
}

module.exports = usersAPIController;