const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require('express');
const { json } = require("express");
const app = express();

app.get('/products',(req,res)=>{
    admin.firestore().collection("products").get()
        .then(data=>{
            let products = [];
            data.forEach(product=>{
                products.push({
                    productId:product.id,
                    ...product.data()
                });
            });
            return res.json(products);
        })
        .catch(err=>console.log(err))
})

app.post('/newproduct',(req,res)=>{

    const zero = 0

    const newProduct = {
        name: req.body.name,
        description: req.body.description,
        buyed: req.body.buyed,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_handle_created: req.body.user_handle_created,
        user_handle_updated: req.body.user_handle_updated,
        manufactured: req.body.manufactured,
        lotes:[
            {
                lote_intern: req.body.lotes[0].lote_intern,
                lote_vendor: req.body.lotes[0].lote_vendor,
                quantity: req.body.lotes[0].quantity,
                quantity_available: req.body.lotes[0].quantity,
                updated_at: new Date().toISOString(),
                vendor:{
                    email: req.body.lotes[0].vendor.email,
                    name: req.body.lotes[0].vendor.name,
                    phone: req.body.lotes[0].vendor.phone
                }
            }
        ],
        quantity: req.body.lotes[0].quantity
    }

    admin.firestore().collection("products").add(newProduct)
        .then(doc=>{
            res,json({
                message: `Document ${doc.id} created successfully`
            });
        }).catch(err=>{
            res.status(500).json({
                error: 'Something went wrong'
            });
            console.log(err)
        });
})

exports.api = functions.https.onRequest(app);