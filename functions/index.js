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
