const path = require('path');
let db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const {validationResult} = require('express-validator');
const imagesController = require('../imagesController');

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Product = db.Product;
const Brand = db.Brand;
const Category = db.Category;
const Color = db.Color;
const Size = db.Size;
const Visibility = db.Visibility;
const Image = db.Image;

//const { Product, Brand, Category, Color, Size, Visibility } = require('../database/models');

const productAPIController = {

    list: async (req, res) =>{
        try{ 
            let products = await Product.findAll({
                include: [
                   "brand", "category", "color", "size", "visibility", "images"
                ]
            });

            console.log(products);
            console.log("URL: " + req.params.category);
            
            const categoria = req.params.category;
            //return res.render('products/products', {products, categoria});
            
            // API que reemplaza a la funcion normal
            let respuesta = {
                meta: {
                    status : 200,
                    total: products.length,
                    url: 'api/products'
                },
                data: products
            }
            res.json(respuesta);
        }
        catch(error){
            res.send({ err: 'Not found' });
        }


    },
    detail: (req, res) =>{
        console.log('entre a Detail product')
        console.log('----------------------------')
        let productId = req.params.id;
        Product.findByPk(productId,
            {
                include : ['images','category','brand', 'color', 'size', 'visibility' ]
            })
            .then(product => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: product.length,
                        url: '/api/products/:id'
                    },
                    data: product
                }
                res.json(respuesta);
            })
            .catch( err => {
                res.send({ err: 'Not found' });
            });
    },
    count: async (req, res) =>{
        try{ 
            let products = await Product.findAll({
                include: [
                   "brand", "category", "color", "size", "visibility", "images"
                ]
            });

            console.log(products);
            console.log("URL: " + req.params.category);
            
            const categoria = req.params.category;
            //return res.render('products/products', {products, categoria});
            
            // API que reemplaza a la funcion normal
            let respuesta = {
                meta: {
                    status : 200,
                    total: products.length,
                    url: 'api/products/count'
                },
                data: products
            }
            res.json("El total de productos es: " + respuesta.meta.total);
        }
        catch(error){
            res.send({ err: 'Not found' });
        }
    },
    category: (req, res) => {
        Product.findAndCountAll({
            include: [
               { model: category, 
                required: true 
            }
            ]
        })
        .then(products => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: products.length,
                    url: 'api/products/countByCat'
                },
                data: products
            }
            res.json(respuesta);
        })
        .catch( err => {
            res.send({ err: 'Not found' });
        });
    }
    


}

module.exports = productAPIController;