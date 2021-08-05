const path = require('path');
let db = require('../../database/models');
const sequelize = db.sequelize;

const pagination = require('./paginationUsers');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const User = db.User;
const Rol = db.Rol;


//const { User, Address } = require('../database/models');

const usersAPIController = {

    list: (req, res) => {
        if ( !req.query.query ) {
            let users = User.findAll({ attributes:['id', 'firstName', 'lastName','email']})
            .then(users => {
                let response = {
                    meta: {
                        status : 200,
                        total: users.length,
                        url: 'api/users'
                    },
                   // data: users
                   data: {
                    list: []
                }
                }
                users.forEach(user => {
                    response.data.list.push({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        detail: `/api/users/${user.id}`
                    })
                    return user
                });
                return res.json(response);
            })
            .catch( err => {
                res.send({ err: 'Not found' });
            });
        } else {
            pagination(req, res);
        }
    },
    detail: (req, res) =>{
        console.log('entre a la api de detalle de usuario')
        console.log('----------------------------')
        let userId = req.params.id;
        User.findByPk(userId, 
            {
            //     include : ['rol']
            attributes:['firstName', 'lastName', 'userName', 'email', 'avatar']
            })
            .then(user => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: user.length,
                        url: '/api/users/:id'
                    },
                    data: {
                        userId : user.id,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        userName : user.userName,
                        email : user.email,
                        avatar : req.headers.host + '/avatars/' + user.avatar
                    }
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
                data: {users}
            }
         res.json("El total de usuarios es " + respuesta.meta.total );
        })
        .catch( err => {
            res.send({ err: 'Not found' });
        });
    }
}

module.exports = usersAPIController;