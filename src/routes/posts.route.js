const express = require('express');
const routes = express.Router();
const posts = require('../controllers/posts.controller');
const { uploadVideo } = require('../middlewares/uploadFile.mid');
const { IsAuthenticated } = require('../middlewares/verifyAccount.mid');

routes.post('/insertPosts', IsAuthenticated, uploadVideo.single('video'), posts.InsertPosts);
routes.delete('/deletePosts/:postId', IsAuthenticated, posts.DeletePosts);
routes.get('/infoPosts/:postsId', posts.InfoPosts);

module.exports = routes;
