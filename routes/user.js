let express = require('express');
let router = express.Router();
let jwtUtils = require('../utils/jwt.utils')
let cookie = require('cookie');
let Intervention = require('../models/Intervention');
let Creneau = require('../models/Creneau');

//const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;


//ROUTES : 
//User's Home:
router.get('/', jwtUtils.authentification, (req, res) => {
    let User = require('../models/User');
    var userId = req.user.userId;
    User.getProfileInfos(userId, (user) => {
        if (user[0] != undefined) {
            res.status(201).render('./privateRoutes/usersHome', { 'user': user[0] });
        } else {
            //res.status(404).json({'error': 'user not found'});
            res.status(404).render('index', { 'error': 'Utilisateur invalide.' });
        }
    })
})

router.get('/profil', jwtUtils.authentification, (req, res) => {
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
        if (user[0] != undefined) {
            console.log(user[0])
            res.status(201).render('./privateRoutes/profil', { 'user': user[0] });
        } else {
            res.status(404).json({ 'error': 'user not found' });
        }
    })
});

router.get('/profil/modify', jwtUtils.authentification, (req, res) => {
    let User = require('../models/User');
    var userId = req.user.userId;
    User.getProfileInfos(userId, (user) => {
        if (user[0] != undefined) {
            //console.log(user[0])
            res.status(201).render('./privateRoutes/profilModification', { 'user': user[0] });
        } else {
            res.status(404).json({ 'error': 'user not found' });
        }
    })
})

router.post('/profil/modify',jwtUtils.authentification, (req,res) => {
    let User = require('../models/User');
    var datas = [];
    console.log(req.body)
    datas.push(req.body.name);
    datas.push(req.body.Prenom);
    datas.push(req.body.email);
    datas.push(req.body.password);
    datas.push(req.body.adresse);
    datas.push(req.body.ville);
    datas.push(req.body.codePostal);
    console.log(datas);
    //console.log(req.body);
    if(req.body.name != null){
        let values = [req.body.name,req.user.userId]

        User.updateName(values, (rows) => {
            console.log(rows);
        });
    }
    res.status(200).redirect('/user/profil/modify');
})

router.get('/reservations', jwtUtils.authentification, (req, res) => {
    //get toutes les réservations dont la date est > ajd
    Intervention.getInterToComeByClient(req.user.userId, (interventions) => {
        //console.log(interventions);
        let results = [];
        let inter = [];
        let cpt = 1;
        for (intervention of interventions) {
            let creneauI = Creneau.StringFromId(intervention.Creneau_idCreneau);
            results.push("'" + intervention.libelleIntervention + "'" + " le " + intervention.dateIntervention.toISOString().slice(0, 10) + " sur le créneau " + creneauI);
            inter.push(intervention);
        }
        res.status(201).render('./privateRoutes/clientsReservations', { 'interventions': results, 'cpt': cpt, 'data': inter });
    })
})

// router.post('/reservations',jwtUtils.authentification, (req, res) => {
//     //delete an intervention :
//     let test = req.body;
//     console.log(test);
//     res.redirect('/user/reservations');
//     let values = {
//         Utilisateur_idUser:req., 
//         Service_idService;,
//         Creneau_idCreneau:
//     }

//     Intervention.delete(values, () =>{
//         res.status(301).redirect('/');
//     })
// })

//DISCONNECT : 
router.get('/disconnect', jwtUtils.authentification, (req, res) => {
    res.setHeader('Set-Cookie', cookie.serialize('authToken', ''));
    console.log("You are logged off");
    return res.status(302).redirect('/');
})




module.exports = router;