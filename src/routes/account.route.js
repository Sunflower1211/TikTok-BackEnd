const express = require('express');
const routes = express.Router();
const account = require('../controllers/account.controller');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { localStrategy, deserializeUser } = require('../middlewares/verifyAccount.mid');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async function (email, password, done) {
            const user = await localStrategy(email, password);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        },
    ),
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await deserializeUser(id);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
});

routes.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/api/account/login',
    }),
    account.login,
);

routes.get('/login', account.errorLogin);

routes.get('/logout', account.logout);

routes.post('/register', account.register);
routes.post('/verifyRegister/:email', account.verifyRegister);
routes.post('/forgotPassword', account.ForgotPassword);
routes.post('/ForgotPasswordOtp/:email', account.ForgotPasswordOtp);
routes.patch('/ForgotPasswordUpdatePassword/:email', account.ForgotPasswordUpdatePassword);

module.exports = routes;
