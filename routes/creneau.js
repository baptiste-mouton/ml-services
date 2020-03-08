let express = require('express');
let router = express.Router();
let Creneau = require('../models/Creneau');
let Intervention = require('../models/Intervention');
let Service = require('../models/Service');
let jwtUtils = require('../utils/jwt.utils');


//ROUTES : 

router.get('/select', jwtUtils.authentification, (req, res) => {
    let week = Creneau.datesSemaineActuelle();
    // console.log(week);
    //Afficher tous les créneaux possibles sur la page :
    Creneau.all(function (creneaux) {
        res.render('./privateRoutes/creneauxSelectDate', { jours: week })
    })
});

router.get('/creneau', jwtUtils.authentification, (req, res) => {
    let Creneau = require('../models/creneau');
    let week = Creneau.datesSemaineActuelle();
    // console.log(week);
    //Afficher tous les créneaux possibles sur la page :
    Creneau.all(function (creneaux) {
        res.render('privateRoutes/creneaux', { jours: week, creneaux: creneaux })
    })
});

router.post('/select', jwtUtils.authentification, (req, res) => {
    let choosenDate = req.body.dateSelection;

    if (choosenDate == undefined) {
        return res.status(400).redirect('/creneau/select', { 'error': 'invalid parameters' });
    }

    return res.status(301).redirect('/creneau/select/byDate/?day=' + choosenDate);

});

router.get('/select/byDate', jwtUtils.authentification, (req, res) => {

    let choosenDate = req.query.day;
    //choosenDate = choosenDate.toISOString().slice(0,10);
    //Trouver seulement les créneaux disponibles pour un jour donné :
    if (choosenDate != null && choosenDate != undefined) {
        Creneau.getCreneauxByDay(choosenDate, (rows) => {
            // console.log("Créneaux indisponibles aujourd'hui : ");
            // console.log(rows[0].Creneau_idCreneau);
            Creneau.all((creneaux) => {
                //console.log(rows[0].Creneau_idCreneau); // syntaxe pour récupérer la valeur de la requête, si on console.log avec autre chose on risque d'obtenir [object Object] inlisible
                var results = [];
                
                for (creneau of creneaux) {
                    var canAdd = true;
                    for (row of rows) {

                        if (row.Creneau_idCreneau == creneau.idCreneau) {
                            canAdd = false;
                        }
                    }
                    if (!(results.includes(creneau)) && canAdd) {
                        results.push(creneau);
                    }
                }
                return res.render('privateRoutes/creneauxByDay', { creneaux: results, date: choosenDate });//On envoie seulemeent les créneaux dispo pour le jour séléctionné
            })   //console.log(res); res contient tous les créneaux du jour exeptés ceux déjà réservés
        })//Une fois qu'on a le res, on n'a plus qu'à rediriger vers la page avec le variable res !
    } //Pour séléctionner les créneaux/jour : AJAX ou 2 étapes : formulaire jour => formulaire créneaux ?
});

// router.get('/select/date',jwtUtils.authentification, async (req,response) => {
//     let choosenDate = req.query.day;
//     let Creneaux = await Creneau.getCreneauxByDay(choosenDate);
//     let tousLesCreneaux = await Creneau.all();
//     var result = [];
//     for(creneau of tousLesCreneaux){
//         if(creneau.idCreneau != Creneaux[0].Creneau_idCreneau){
//             result.push(creneau);
//         }
//     response.render('privateRoutes/select/creneauxByDay',{creneaux: result});
//     }
// });

router.post('/select/byDate', jwtUtils.authentification, (req, res) => {
    console.log(req.headers.referer);
    let choiceCr = req.body.selectedCre;
    let choiceSer = req.body.selectedSer;
    let userId = req.user.userId;
    let libIntervention = choiceSer;
    let descrInter = null;

    if (req.body.descritpionIntervention != undefined && req.body.descritpionIntervention != null) {
        descrInter = req.body.descriptionIntervention
    }

    switch (choiceCr) {
        case '08:00 - 09:00': choiceCr = 1; break;
        case '09:00 - 10:00': choiceCr = 2; break;
        case '10:00 - 11:00': choiceCr = 3; break;
        case '11:00 - 12:00': choiceCr = 4; break;
        case '12:00 - 13:00': choiceCr = 5; break;
        case '13:00 - 14:00': choiceCr = 6; break;
        case '14:00 - 15:00': choiceCr = 7; break;
        case '15:00 - 16:00': choiceCr = 8; break;
        case '16:00 - 17:00': choiceCr = 9; break;
        case '17:00 - 18:00': choiceCr = 10; break;
        default : choiceCr = 0;
    }

    switch (choiceSer) {
        case 'Ménage': choiceSer = 1; break;
        case 'Repassage': choiceSer = 2; break;
        case 'Cuisine': choiceSer = 3; break;
        case 'Aide au déplacement': choiceSer = 4; break;
    }

    //create a service
    let dataService = {
        TypeService_codeTypeService: choiceSer
    }

    Service.create(dataService, async (rows) => {
        let idNewService = await rows.insertId;

        //then an intervention :
        let values = {
            Utilisateur_idUser: userId,
            Creneau_idCreneau: choiceCr,
            Service_idService: idNewService,
            libelleIntervention: libIntervention,
            dateIntervention: req.headers.referer.slice(-10),
            descriptionIntervention: descrInter
        }

        Intervention.create(values, (rows) => {
            //Peut-être cookies pour afficher flash ?
            res.redirect('/user');
        })
    })
})

//mettre en place un système pour indiquer que l'opération est validée ou non !


module.exports = router;
