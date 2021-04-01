const UserModel = require('../models/user.model');
const {signUpErrors,signInErrors} = require('../utils/error.utils');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60 * 1000;

// jwt token creation function
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

// inscription
module.exports.signUp = async (req, res) => {
    const { pseudo, email, password } = req.body;
    try {
        const user = await UserModel.create({ pseudo, email, password });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = signUpErrors(err);
        res.status(200).send({ errors });
    }
};

// connection
module.exports.signIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = signInErrors(error);
        res.status(500).json(errors); 
    }
};


// deconnexion
module.exports.logout = (req, res) => {
    console.log('ça commence');
    res.cookie('jwt', '', { maxAge: 1 });
    console.log('ça taf');
    res.redirect('/');
}

