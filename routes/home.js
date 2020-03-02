let express = require('express');
let router = express.Router();
let mysqlConnection = require('../config/dbConfig');

//Home :
router.get('/', (req, res) => {
    let Creneaux = require('../models/Creneau');
    Creneaux.all(function(creneaux){
        res.render('index', {creneaux: creneaux})
    })
    /*mysqlConnection.query('SELECT * FROM Creneau', (err,rows,field) => {
        if(!err){
            var creneaux = rows
            res.render('index',{creneaux: creneaux})
        }else{
            console.log(err)
        }
    })*/
    
});

module.exports = router;