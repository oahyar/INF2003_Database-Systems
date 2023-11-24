const jwt = require('jsonwebtoken');
const config = require('../config/config');

function generateToken(user) {
    return jwt.sign(user, config.passSecret);
}

function authToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, config.passSecret, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
}

module.exports = {
    generateToken,
    authToken,
};
