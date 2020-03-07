let express = require('express');
let router = express.Router();
let jwtUtils = require('../utils/jwt.utils')
let cookie = require('cookie');
let Intervention = require('../models/Intervention');
let Creneau = require('../models/Creneau');

    //ROUTES : 
//Admin's Home:
router.get('/',jwtUtils.authentification,jwtUtils.isAdmin, (req,res) => {
    let User = require('../models/User');
    var userId = req.user.userId;
    User.getProfileInfos(userId, (user) => {
        if(user[0] != undefined){
            res.status(201).render('./privateRoutes/adminsHome',{'user':user[0]});
        } else {
            res.status(404).render('index',{'error': 'Utilisateur invalide.'});
        }
})
})

router.get('/profil', jwtUtils.authentification, (req,res) => {
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

router.get('/reservations',jwtUtils.authentification, (req,res) => {
    //get toutes les réservations dont la date est > ajd
    Intervention.getInterToComeByClient(req.user.userId, (interventions) => {
        console.log(interventions);
        let results = [];
        for(intervention of interventions){
            let creneauI = Creneau.StringFromId(intervention.Creneau_idCreneau);
            results.push("'" + intervention.libelleIntervention + "'" + " le " + intervention.dateIntervention.toISOString().slice(0,10) + " sur le créneau " + creneauI);
        }
        res.status(201).render('./privateRoutes/clientsReservations',{'interventions': results});
    })
})

//DISCONNECT : 
router.get('/disconnect',jwtUtils.authentification, (req,res) => {
    res.setHeader('Set-Cookie',cookie.serialize('authToken', ''));
    console.log("You are logged off");
    return res.status(302).redirect('/');
})




module.exports = router;