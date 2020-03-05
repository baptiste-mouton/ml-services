let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let jwtUtils = require('../utils/jwt.utils')
let cookie = require('cookie');
let {check,validationResult} = require('express-validator');


//const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

//ROUTES : 
router.get('/creneaux', (req, res) => {
    let Creneau = require('../models/creneau');
    let week = Creneau.datesSemaineActuelle();
    console.log(week);
    Creneau.all(function(creneaux){
        res.render('privateRoutes/creneaux', {jours: week,creneaux: creneaux})
    })
    
});
//User's Home:
router.get('/myHome',jwtUtils.authentification, (req,res) => {
    let User = require('../models/User');
    var userId = req.user.userId;
    User.getProfileInfos(userId, (user) => {
        if(user[0] != undefined){
            res.status(201).render('./privateRoutes/usersHome',{'user':user[0]});
        } else {
            res.status(404).json({'error': 'user not found'});
        }
})
})
//Login Page:
router.get('/login', (req, res) => {
    res.render('login')
});

//Register Page:
router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/myProfil', jwtUtils.authentification, (req,res) => {
    /*var headerAuth = req.headers['authorization'];
    console.log(headerAuth)
    var userId = jwtUtils.getUserId(headerAuth);

    if(userId<0){
        return res.status(400).json({'error': 'Wrong token!'});
    }
    
    let User = require('../models/User');
    User.getProfileInfos(userId, (user) => {
        if(user[0] != undefined){
            res.status(201).json(user[0]);
            res.render('/profil',{user:user[0]});
        } else {
            res.status(404).json({'error': 'user not found'});
        }
    })*/

    let User = require('../models/User');
    var userId = req.user.userId;
    User.getProfileInfos(userId, (user) => {
        if(user[0] != undefined){
            res.status(201).render('./privateRoutes/profil',{'user':user[0]});
        } else {
            res.status(404).json({'error': 'user not found'});
        }
})
});
//DISCONNECT : 
router.get('/disconnect',jwtUtils.authentification, (req,res) => {
    res.setHeader('Set-Cookie',cookie.serialize('authToken', ''));
    console.log("You are logged off");
    return res.status(302).redirect('/');
})
//Page creneau :
router.get('/creneaux', (req,res) => {
    let Creneaux = require('../models/Creneau');
    Creneaux.all(function(creneaux){
        res.render('creneaux', {creneaux: creneaux})
    })
})

//REGISTER : 
router.post('/register',
[
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({min: 6, max:12}),
    check('name').isLength({min:2})
],
(req,res) => {
    var lastName = req.body.name;
    var firstName = req.body.firstName;
    var password = req.body.password;
    var email = req.body.email;
    var tel = req.body.tel;
    var st = req.body.street;
    var zip = req.body.zip;
    var city = req.body.city;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({'error': 'Missing or wrong parameters'});
    }
    /* Vérifs avec express-validator plus efficace
    if(lastName == undefined || firstName == undefined || password == undefined || email == undefined || st == undefined || zip == undefined || city == undefined){
        return res.status(400).json({'error': 'missing parameters'});
    }

    if (lastName.length > 12 || lastName.length < 2) {
        return res.status(400).json({'error': 'Le nom doit contenir entre 2 et 12 carractères'});
    }

    if(!EMAIL_REGEX.test(email)){
        return res.status(400).json({'error': 'L\'email n\'est pas conforme'});
    }

    if(!PASSWORD_REGEX.test(password)){
        return res.status(400).json({'error': 'Le mot de passe n\'est pas conforme. (Il doit contenir entre 4 et 8 caractères dont au moins 1 chiffre!)'});
    } */

    
    console.log(email);
    let User = require('../models/User')
    User.findByMail(email, (users) => {
        if(users[0] == undefined) {
                let salt =  bcrypt.genSaltSync(10);
                let hashedPassword =  bcrypt.hashSync(password,salt);

                var values = {
                    nomUser: lastName,
                    prenomUser: firstName,
                    password: hashedPassword,
                    emailUser: email,
                    numTelUser: tel,
                    rue:st,
                    codePostal: zip,
                    ville: city,
                    estAdmin: 0
                }
                User.create(values, (rows) =>{
                console.log('Request sent !');
                //res.redirect('/');
                res.json({'userId = ':rows.insertId});
                })
        }else{
            return res.status(409).json({'error': 'client already exists'});
        }
    })
});

//LOGIN
router.post('/login',
[
    check('email').not().isEmpty(),
    check('password').not().isEmpty()
],
(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({'error': 'Missing or wrong parameters'});
    }

    let User = require('../models/User')
    User.findByMail(email,(users)=>{
        if(users[0] == undefined){
            return res.status(400).json({'error': 'Email ou mot de passe inconnu'});
        }else {
                let compare = bcrypt.compareSync(password,users[0].password);
                if(compare){
                    var authToken = jwtUtils.createToken(users[0]);

                    res.setHeader('Set-Cookie', cookie.serialize('authToken','Bearer ' + authToken, { //Bearer : norme JW3
                        httpOnly: true,
                        maxAge: 60 * 60 // 1 h
                      }));
        
                    return res.status(302).redirect('/user/myHome');

                }else{
                    return res.status(400).json({'error': 'Email ou mot de passe inconnu'});
                    }
            }
    })
});


module.exports = router;