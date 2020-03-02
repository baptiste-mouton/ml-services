let express = require('express');
let router = express.Router();
let mysqlConnection = require('../config/dbConfig');

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
module.exports = router;