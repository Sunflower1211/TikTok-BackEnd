const express = require('express');
const routes = express.Router();
const notify = require('../controllers/notify.controller');

routes.get('/listAllNotify', notify.ListAllNotify);
routes.get('/listNotifyPosts', notify.ListNotifyPosts);
routes.get('/listNotifyComment', notify.ListNotifyComment);
routes.get('/listNotifyFollower', notify.ListNotifyFollower);
routes.get('/countUnreadNotify', notify.CountUnreadNotify);

module.exports = routes;
