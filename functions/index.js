const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require('express')()

admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyD9TSnG5MhWsojwcJz7NzF8By9YXDZ1XxM",
    authDomain: "mvp-biodel.firebaseapp.com",
    projectId: "mvp-biodel",
    storageBucket: "mvp-biodel.appspot.com",
    messagingSenderId: "311949773925",
    appId: "1:311949773925:web:efcfed3aaa80924877ca8c",
    measurementId: "G-K0XTLCKBWY"
};

const db = admin.firestore();

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

app.get('/products',(req,res)=>{
    db.collection("products").get()
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

    db.collection("products").add(newProduct)
        .then(doc=>{
            res.json({
                message: `Document ${doc.id} created successfully`
            });
        }).catch(err=>{
            res.status(500).json({
                error: 'Something went wrong'
            });
            console.log(err)
        });
})

// Signup route
app.post('/signup',(req,res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    // TODO: Validate data
    firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
        .then(data => {
            return res.status(201).json({ message: `user ${data.user.uid} signed up successfully` });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.code });
        })
})

exports.api = functions.https.onRequest(app);