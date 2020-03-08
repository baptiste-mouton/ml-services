let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let jwtUtils = require('../utils/jwt.utils')
let cookie = require('cookie');
let { check, validationResult } = require('express-validator');

//ROUTES :
//GETS : 
//Home :
router.get('/', (req, res) => {
    res.render('index');
})

//Login Page:
router.get('/login', (req, res) => {
    res.render('login')
});

//Register Page:
router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/services', (req, res) => {
    res.render('services')
})

//POSTS :

//REGISTER : 
router.post('/register',
    [
        check('email').isEmail().normalizeEmail(),
        check('password').isLength({ min: 6, max: 12 }),
        check('name').isLength({ min: 2 })
    ],
    (req, res) => {
        var name = req.body.name;
        var prenom = req.body.Prenom;
        var password = req.body.password;
        var email = req.body.email;
        var st = req.body.adresse;
        var zip = req.body.codePostal;
        var city = req.body.ville;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            //return res.status(400).json({'error': 'Missing or wrong parameters'});
            return res.status(409).render('register', { 'error': 'Complétez tous les champs avant de soumettre le formulaire. Le mot de passe doit contenir entre 6 et 12 caractères !' });
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
        
        let User = require('../models/User')
        User.findByMail(email, (users) => {
            if (users[0] == undefined) {
                let salt = bcrypt.genSaltSync(10);
                let hashedPassword = bcrypt.hashSync(password, salt);

                var values = {
                    nomUser: name,
                    prenomUser: prenom,
                    password: hashedPassword,
                    emailUser: email,
                    rue: st,
                    codePostal: zip,
                    ville: city,
                    estAdmin: 0
                }
                User.create(values, (rows) => {
                    res.json({ 'userId = ': rows.insertId });
                })
                res.redirect('/')
            } else {
                return res.status(409).render('register', { 'error': 'Cet addresse mail est déjà utilisée.' });
            }
        })
    });

//LOGIN
router.post('/login',
    [
        check('email').not().isEmpty(),
        check('password').not().isEmpty()
    ],
    (req, res) => {
        var email = req.body.email;
        var password = req.body.password;

        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).render('login', { 'error': 'Complétez tous les champs avant de soumettre le formulaire.' });
        }

        let User = require('../models/User')
        User.findByMail(email, (users) => {
            if (users[0] == undefined) {
                return res.status(400).render('login', { 'error': 'Email ou mot de passe inconnu.' });
            } else {
                let compare = bcrypt.compareSync(password, users[0].password);
                if (compare) {
                    var authToken = jwtUtils.createToken(users[0]);

                    res.setHeader('Set-Cookie', cookie.serialize('authToken', 'Bearer ' + authToken, { //Bearer : norme JW3
                        httpOnly: true,
                        maxAge: 60 * 60 // 1h
                    }));
                    console.log(users[0].estAdmin)
                    if (users[0].estAdmin == 1) {
                        return res.status(302).redirect('/user/admin');
                    } else {
                        return res.status(302).redirect('/user');
                    }

                } else {
                    return res.status(400).render('login', { 'error': 'Email ou mot de passe inconnu' });
                }
            }
        })
    });

    router.get('/admin',jwtUtils.isAdmin, (req,res) => {
        res.render('/privateRoutes/adminsHomePage');

    })

module.exports = router;