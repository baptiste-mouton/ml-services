var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET;

module.exports = {
    createToken: function(userData){
        return jwt.sign({
            userId: userData.idUser,
            isAdmin: userData.estAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn : '1h'
        })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ','') : null;
    },
    getUserId: function(authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null){
            try{
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                console.log(jwtToken);
                if(jwtToken != null){
                    userId = jwtToken.userId;
                }
            }catch(err){ }
        }
        return userId;
    }

};