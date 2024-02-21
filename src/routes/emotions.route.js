const express = require('express');
const routes = express.Router();
const emotions = require('../controllers/emotions.controller');

routes.post('/insertEmotions/:postsId', emotions.InsertEmotions);
routes.delete('/deleteEmotions/:postsId', emotions.DeleteEmotions);
routes.get('/listEmotions/:postsId', emotions.ListEmotions);

module.exports = routes;
