let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let mysqlConnection = require('../config/dbConfig');

function isEmpty(obj) {
    return !Object.keys(obj).length > 0;
  };

//Login :
router.get('/login', (req, res) => {
    res.render('login')
});

//Register :
router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/creneaux', (req,res) => {
    let Creneaux = require('../models/Creneau');
    Creneaux.all(function(creneaux){
        res.render('creneaux', {creneaux: creneaux})
    })
})

//test:
router.post('/register',(req,res) => {
    var lastName = req.body.name;
    var firstName = req.body.firstName;
    var password = req.body.password;
    var email = req.body.email;
    var tel = req.body.tel;
    var st = req.body.street;
    var zip = req.body.zip;
    var city = req.body.city;

    if(lastName == undefined || firstName == undefined || password == undefined || email == undefined || st == undefined || zip == undefined || city == undefined){
        return res.status(400).json({'error': 'missing parameters'});
    }

    //TODO verify pseudo length, mail regex, password...
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

    
router.post('/login', (req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    if(email == undefined || password == undefined || email == '' || password == '') {
        return res.status(400).json({'error': 'missing parameters'});
    }

    let User = require('../models/User')
    User.findByMail(email,(users)=>{
        if(users[0] == undefined){
            return res.status(400).json({'error': 'Email ou mot de passe inconnu'});
        }else {
                let compare = bcrypt.compareSync(password,users[0].password);
                if(compare){
                    return res.status(200).json({
                        'userId': users[0].idUser,
                        'token': 'THE TOKEN'});
                }else{
                    return res.status(400).json({'error': 'Email ou mot de passe inconnu'});
                    }
            }
    })
});


module.exports = router;