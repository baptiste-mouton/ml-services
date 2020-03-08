let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let jwtUtils = require('../utils/jwt.utils')
let cookie = require('cookie');
let Intervention = require('../models/Intervention');
let Creneau = require('../models/Creneau');
let User = require('../models/User');
let { check, validationResult } = require('express-validator');

//const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;


//ROUTES : 
//User's Home:
router.get('/', jwtUtils.authentification, (req, res) => {
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
    
    
    User.getProfileInfos(userId, (user) => {
        if(user[0] != undefined){
            res.status(201).json(user[0]);
            res.render('/profil',{user:user[0]});
        } else {
            res.status(404).json({'error': 'user not found'});
        }
    })*/


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

router.post('/profil/modify', jwtUtils.authentification,
    [
        check('email').isEmail().normalizeEmail(),
    ],
    (req, res) => {
        console.log(req.body)
        let errors = validationResult(req.body.email)

        if (req.body.name != '' && req.body.name.length > 2) {
            let values = [req.body.name, req.user.userId]
            User.updateNom(values, (rows) => {
                console.log(rows);
            });
        }

        if (req.body.prenom != '' && req.body.prenom.length > 2) {
            let values = [req.body.prenom, req.user.userId];
            User.updatePrenom(values, (rows) => {
                console.log(rows);
            });
        }

        if (req.body.email != '@' && errors.isEmpty()) {
            let values = [req.body.email, req.user.userId];
            User.updateEmail(values, (rows) => {
                console.log(rows);
            });
        }

        if (req.body.password != '' && req.body.password.length > 6 && req.body.password.length < 12) {

            let salt = bcrypt.genSaltSync(10);
            let hashedPassword = bcrypt.hashSync(req.body.password, salt);

            let values = [hashedPassword, req.user.userId];
            User.updatePassword(values, (rows) => {
                console.log(rows);
            });
        }

        if (req.body.adresse != '') {
            let values = [req.body.adresse, req.user.userId];
            User.updateAdresse(values, (rows) => {
                console.log(rows);
            });
        }

        if (req.body.ville != '') {
            let values = [req.body.ville, req.user.userId];
            User.updateVille(values, (rows) => {
                console.log(rows);
            });
        }

        if (req.body.codePostal != '') {
            let values = [req.body.codePostal, req.user.userId];
            User.updateCodePostal(values, (rows) => {
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