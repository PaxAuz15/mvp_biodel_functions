const functions = require("firebase-functions");
const app = require('express')()

const { getAllProducts, postProduct } = require('./handlers/products');
const { signup, login } = require('./handlers/users')
const FBAuth = require('./util/fbAuth')

//TODO: Products Route
app.get('/products', getAllProducts);
app.post('/newproduct', FBAuth, postProduct);

// TODO: Users route
app.post('/signup',signup)
app.post('/login', login)

exports.api = functions.https.onRequest(app);
