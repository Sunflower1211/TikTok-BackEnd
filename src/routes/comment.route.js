const express = require('express');
const routes = express.Router();
const comment = require('../controllers/comment.controller');

routes.get('/listComment/:postsId', comment.ListComment);

module.exports = routes;
