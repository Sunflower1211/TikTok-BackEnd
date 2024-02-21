const express = require('express');
const routes = express.Router();
const search = require('../controllers/search.controller');

routes.get('/searchAccount', search.searchAccount);

module.exports = routes;
