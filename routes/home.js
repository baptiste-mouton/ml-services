let express = require('express');
let router = express.Router();
let mysqlConnection = require('../config/dbConfig');

//Home :
router.get('/', (req, res) => {
    let Creneaux = require('../models/Creneau');
    Creneaux.all(function(creneaux){
        res.render('index', {creneaux: creneaux})
    })
    
});

router.get('/creneaux', (req, res) => {
    let Creneaux = require('../models/Creneau');
    Creneaux.all(function(creneaux){
        res.render('creneaux', {creneaux: creneaux})
    })
    
});

module.exports = router;