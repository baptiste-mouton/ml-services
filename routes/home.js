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

router.get('/services', (req,res) => {
    res.render('services')
})


module.exports = router;