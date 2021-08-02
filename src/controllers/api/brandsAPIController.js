const path = require('path');
let db = require('../../database/models');
const sequelize = db.sequelize;


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Brand = db.Brand;


//const { Brand } = require('../database/models');

const brandsAPIController = {

    list: (req, res) => {
        Brand.findAll({ attributes:['id', 'name']})
        .then(brands => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: brands.length,
                    url: 'api/brands'
                },
               // data: brands
               data: []
            }
            brands.forEach(brand => {
                respuesta.data.push({
                    id: brand.id,
                    name: brand.name,
                })
            });
            return res.json(respuesta);
        })
        .catch( err => {
            res.send({ err: 'Not found' });
        });
    },
    detail: (req, res) =>{
        console.log('entre a la api de detalle de marcas')
        console.log('----------------------------')
        let brandId = req.params.id;
        Brand.findByPk(brandId, 
            {
            attributes:['name']
            })
            .then(brand => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: brand.length,
                        url: '/api/brands/:id'
                    },
                    data: {
                        brandId : brand.id,
                        name : brand.name
                    }
                }
                res.json(respuesta);
            })
            .catch( err => {
                res.send({ err: 'Not found' });
            });
    },
    
    count: (req, res) =>{
        Brand.findAll()
        .then(brands => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: brands.length,
                    url: 'api/brands/count'
                },
                data: {brands}
            }
         res.json("El total de marcas es " + respuesta.meta.total );
        })
        .catch( err => {
            res.send({ err: 'Not found' });
        });
    }
}

module.exports = brandsAPIController;