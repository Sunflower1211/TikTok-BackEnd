const express = require('express');
const routes = express.Router();
const home = require('../controllers/home.controller');
const { IsAuthenticated } = require('../middlewares/verifyAccount.mid');

routes.get('/newsFeeds', IsAuthenticated, home.ListNewsFeeds);
routes.get('/foryou', IsAuthenticated, home.ListHome);
routes.get('/guest', home.ListGuest);

module.exports = routes;
