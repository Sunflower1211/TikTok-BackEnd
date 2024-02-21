const express = require('express');
const routes = express.Router();
const user = require('../controllers/user.controller');
const { uploadImage } = require('../middlewares/uploadFile.mid');
const { IsAuthenticated } = require('../middlewares/verifyAccount.mid');

routes.get('/infoUser', IsAuthenticated, user.InfoUser);
routes.put('/editProfile', IsAuthenticated, uploadImage.single('avatar'), user.EditProfile);
routes.patch('/editPassword', IsAuthenticated, user.EditPassword);
routes.get('/profile/:accountId', user.Profile);

module.exports = routes;
