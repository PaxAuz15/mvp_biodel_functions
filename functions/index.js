const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.getVendors = functions.https.onRequest((req,resp)=>{
    admin.firestore().collection("vendors").get()
        .then((data) =>{
            let vendors=[];
            data.forEach((doc) =>{
                vendors.push(doc.data());
            });
            return resp.json(vendors);
        })
        .catch((err)=>console.log(err));
})

exports.createAgents = functions.https.onRequest((req,res)=>{
    if (req.method !== 'POST'){
        return res.status(400).json({ error: 'Method not allowed' });
    }

    const newAgent = {
        email: req.body.email,
        names: req.body.names,
        last_name: req.body.last_name,
        phone: req.body.phone
    }

    admin.firestore().collection('agents').add(newAgent).then(doc => {
        res.json({ message: `document ${doc.id} created successfully`});
    }).catch(err => {
        res.status(500).json({ error: 'something went wrong'});
        console.log(err)
    });
});