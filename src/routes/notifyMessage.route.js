const express = require('express');
const routes = express.Router();
const notifyMessage = require('../controllers/notifyMessage.controller');

routes.get('/listMessagePrivate', notifyMessage.ListMessagePrivate);
routes.get('/listMessageGroup', notifyMessage.ListMessageGroup);

module.exports = routes;
