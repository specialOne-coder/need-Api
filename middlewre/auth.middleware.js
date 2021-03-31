const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

// verification du token présenté par l'utilisateur
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge: 1 });
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                console.log(res.locals.user);
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

// voir a sa nouvelle venue s'il possede déja un jeton vivant et le rediriger auto
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err)
            } else {
                console.log(decodedToken.id);
                next();
            }
        })
    } else {
        console.log('No token');
    }
}