const express = require('express');
const routes = express.Router();
const follow = require('../controllers/follow.controller');

routes.post('/insertFollow/:userFollowId', follow.InsertFollow);
routes.delete('/deleteFollow/:userFollowId', follow.DeleteFollow);
routes.get('/listFollowing/:userId', follow.ListFollowingDetail);
routes.get('/listFollower/:userId', follow.ListFollowers);

module.exports = routes;
