var jwt = require('jsonwebtoken');
let env = require('dotenv');
let cookie = require('cookie');
let User = require('../models/User');

env.config();

let TOKEN_SECRET = process.env.TOKEN_SECRET;

module.exports = {
    createToken: function (userData) {
        return jwt.sign({
            userId: userData.idUser,
            isAdmin: userData.estAdmin
        },
            TOKEN_SECRET,
            {
                expiresIn: '1h'
            })
    },

    authentification: function (req, res, next) {
        if (req != undefined && res != undefined) {

            // Parse the cookies on the request
            var cookies = cookie.parse(req.headers.cookie || '');

            // Get the visitor name set in the cookie
            var token = cookies.authToken;

            if (!token) return res.status(401).send('Accès refusé...');

            try {
                var parsedToken = module.exports.parseAuthorization(token);
                const verified = jwt.verify(parsedToken, TOKEN_SECRET);
                req.user = verified;
                next();
            } catch (err) {
                res.status(400).send('Invalid token')
            }
        }
    },

    isAdmin: function (req, res, next) {
        if (req != undefined && res != undefined) {
            var cookies = cookie.parse(req.headers.cookie || '');
            var token = cookies.authToken;
            if (!token) return res.status(401).send('Accès refusé...');
            try {
                var parsedToken = module.exports.parseAuthorization(token);
                const verified = jwt.verify(parsedToken, TOKEN_SECRET);
                if (verified.isAdmin == 1) {
                    req.user = verified;
                    next();
                } else {
                    res.status(400).send('Vous n\'êtes pas connecté en tant qu\'administrateur.')
                }

            } catch (err) {
                res.status(400).send('Vous n\'êtes pas connecté.')
            }
        }
    },

    parseAuthorization: function (authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function (authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, TOKEN_SECRET);
                console.log(jwtToken);
                if (jwtToken != null) {
                    userId = jwtToken.userId;
                }
            } catch (err) { }
        }
        return userId;
    }

};