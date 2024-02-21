const express = require('express');
const { errorHandler } = require('../middlewares/errorHandler.mid');
const { IsAuthenticated } = require('../middlewares/verifyAccount.mid');
const routes = express.Router();

routes.use('/api/account', require('./account.route'));
routes.use('/api/posts', require('./posts.route'));
routes.use('/api/home', require('./home.route'));
routes.use('/api/emotions', IsAuthenticated, require('./emotions.route'));
routes.use('/api/follow', IsAuthenticated, require('./follow.route'));
routes.use('/api/user', require('./user.route'));
routes.use('/api/comment', require('./comment.route'));
routes.use('/api/reply', require('./replies.route'));
routes.use('/api/notify', IsAuthenticated, require('./notify.route'));
routes.use('/api/message', IsAuthenticated, require('./message.route'));
routes.use('/api/notifyMessage', IsAuthenticated, require('./notifyMessage.route'));
routes.use('/api/search', require('./search.route'));

routes.use((req, res, next) => {
    next(createError(404, 'Not found'));
});

//err colection
routes.use(errorHandler);

module.exports = routes;
