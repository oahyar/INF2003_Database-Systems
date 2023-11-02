const jwt = require('jsonwebtoken');
const config = require('../config/config')

function generateToken(user){
    return jwt.sign(user, config.passSecret);
}

function authToken(req, res, next){
    const token = res.cookie('token');
    jwt.verify(token, config.passSecret, (err, user)=> {
        if(err){
            console.log(err)
            res.status(403).send("Error in accessing resource");
        }
        req.user = user;
        next()
    })

}

module.exports = {
    generateToken,
    authToken
}