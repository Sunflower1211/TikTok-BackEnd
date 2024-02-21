const _user = require('../models/user.model');
const createError = require('http-errors');

const localStrategy = async (email, password) => {
    try {
        const user = await _user.findOne({ email, password });
        return user;
    } catch (error) {
        console.log(error);
    }
};

const deserializeUser = async (id) => {
    try {
        const user = await _user.findOne({ _id: id });
        return user;
    } catch (error) {
        console.log(error);
    }
};

const IsAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return next(createError(401, 'Unauthorized'));
    }
};

module.exports = {
    localStrategy,
    deserializeUser,
    IsAuthenticated,
};
