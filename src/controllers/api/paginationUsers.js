const { User, Product } = require('../../database/models');
const { Op } = require("sequelize");


module.exports = (req, res) => {
    let query = JSON.parse(req.query.query);

    let response = {
        meta: {
            status: 500,
            msg: 'ocurrió un error inesperado',
            count: 0,
            totalPages: 0,
            next: null,
            prev: null,
            query: {
                page: parseInt(query.page) || 1,
                perPage: parseInt(query.perPage) || 10,
                firstName: query.firstName || '',
                lastName: query.lastName || '',
                email: query.email || '',
                url: `/api/users/?query=${JSON.stringify(query)}`
            }
        },
        data: {
            list: [
                {
                    id: null,
                    firstName: '',
                    lastName: '',
                    email: ''
                },
            ]
        }
    };

    let offset = (response.meta.query.page -1) * response.meta.query.perPage;

    User.findAndCountAll({ 
        attributes: [
            'id',
            'firstName', 
            'lastName', 
            'email'
        ],
        where: { 
            firstName: { [Op.substring]: response.meta.query.firstName }, 
            lastName: { [Op.substring]: response.meta.query.lastName }, 
            email: { [Op.substring]: response.meta.query.email }, 
        },
        order: [ 
            ['id', 'ASC'], 
            // ['firstName', 'DESC'], 
            // ['lastName', 'DESC'], 
            // ['email', 'DESC'] 
        ],
        limit: response.meta.query.perPage,
        offset,
        distinct: true
    })
    .then( result => JSON.parse(JSON.stringify(result)) )
    .then( result => {
        if (result.rows.length) {
            response.meta.status = 200;
            response.meta.msg = 'Listado de usuarios paginado obtenido exitosamente';
            response.meta.count = result.count;
            response.meta.totalPages = Math.ceil(response.meta.count / response.meta.query.perPage);

            let currentPage = response.meta.query;
            if ( currentPage.page < response.meta.totalPages ) {
                response.meta.next = {
                    page: currentPage.page + 1,
                    perPage: currentPage.perPage,
                    firstName: currentPage.firstName,
                    lastName: currentPage.lastName,
                    email: currentPage.email,
                };
                response.meta.next.url = `http://localhost:3001/api/users/?query=${JSON.stringify(response.meta.next)}`;
            }
            
            if ( currentPage.page > 1 ) {
                response.meta.prev = {
                    page: currentPage.page - 1,
                    perPage: currentPage.perPage,
                    firstName: currentPage.firstName,
                    lastName: currentPage.lastName,
                    email: currentPage.email
                };
                response.meta.prev.url = `http://localhost:3001/api/users/?query=${JSON.stringify(response.meta.prev)}`;
            }

            response.data.list = result.rows.map(row => {
                let user = {
                    id: row.id,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email,
                    detail: `/api/users/${row.id}`   //Capturar location host y agregar a la url al comienzo
                };

                return user
            });
    
            return res.json(response)
        }

        response.meta.status = 404;
        response.meta.msg = 'Not found';
        res.status(404).json(response)

    })
    .catch( err => {
        console.log(err);
        res.status(500).json(response)
    });
}



/*

Ruta endpoint ejemplo: 

http://localhost:3001/api/users/?query={"page":"1","perPage":"2","firstName":"mati","lastName":"vie","email":"matit"}

Ruta base: http://localhost:3001/api/users/ (Que devuelve listado completo)

Ruta paginada: http://localhost:3001/api/users/?query={} (JSON query) 
    -ruta minima para alcanzar paginado con los siguientes valores por defecto [iniciales]:
        -page: 1
        -perPage: 10
        -firstName: ''
        -lastName: ''
        -email: ''

        
La ruta paginada devuelve un objeto JSON que indica: 
    En meta: 
        -> status: 500 || 404 || 200
        -> msg: (Mensaje de error o exito acorde a cada status)
        -> count: 0 a N cantidad de registros totales encontrados
        -> next: Objeto literal con las propiedades de query y url de la siguiente página. 
    En data: 
*/