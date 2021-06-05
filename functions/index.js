const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/vendors',(req,res)=>{
    admin.firestore().collection("vendors").get()
        .then((data) =>{
            let vendors=[];
            data.forEach((doc) =>{
                vendors.push({
                    vendorId: doc.id,
                    agent_id: doc.data().agent_id,
                    email: doc.data().email,
                    name: doc.data().name,
                    phone_vendor_id: doc.data().phone_vendor_id,
                    vendors_set_id: doc.data().vendors_set_id,
                    created_at: doc.data().created_at,
                    updated_at: doc.data().updated_at
                });
            });
            return res.json(vendors);
        })
        .catch((err)=>console.log(err));
})

app.post('/agent',(req,res)=>{

    const newAgent = {
        email: req.body.email,
        names: req.body.names,
        last_name: req.body.last_name,
        phone: req.body.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    admin.firestore().collection('agents').add(newAgent).then(doc => {
        res.json({ message: `document ${doc.id} created successfully`});
    }).catch(err => {
        res.status(500).json({ error: 'something went wrong'});
        console.log(err)
    });
});

exports.api = functions.https.onRequest(app);