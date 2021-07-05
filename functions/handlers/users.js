const { db } = require('../util/admin');
const config = require('../util/config')
const { validateSignUpData, validateLoginData } = require('../util/validators')

const firebase = require('firebase');
firebase.initializeApp(config);

exports.signup = (req,res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignUpData(newUser);

    if(!valid) return res.status(400).json(errors);

    //TODO: Validate date
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'This handle is already taken' });
            }else{
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email,newUser.password);
            }
        })
        .then(data =>{
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken =>{
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            try{
                return db.doc(`/users/${newUser.handle}`).set(userCredentials);
            } catch{
                console.error('ERROR DE GUARDAR')
            }
        })
        .then(()=> res.status(201).json({ token }))
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use' })
            }else{
                return res.status(500).json({ error: err.code });
            }
        })
};

exports.login = (req,res)=>{
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);

    if(!user) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
        .then(data => data.user.getIdToken())
        .then(token => res.json({token}))
        .catch(err=>{
            if(err.code === 'auth/wrong-password'){
                return res.status(403).json({general: 'Wrong credential. Please try again'})
            }else{
                return res.status(500).json({error: err.code});
            }
        })
}
