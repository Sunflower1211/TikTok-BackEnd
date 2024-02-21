const _posts = require('../models/posts.model');
const _user = require('../models/user.model');

const { PutHome, PutNewsFeeds, DeleteHome, DeleteNewsFeeds } = require('./home.services');

const { InsertNotify, DeleteNotifyPosts } = require('../services/notify.services');

const InsertPosts = async ({ userid, content, video }) => {
    try {
        const insertPosts = await _posts.create({
            userid,
            content,
            video,
        });
        if (!insertPosts) {
            return {
                statusCode: 400,
                message: 'Insert posts fail',
            };
        }
        const data = {
            postsId: insertPosts._id,
            userId: userid,
        };

        const followers = await _user.findOne({ _id: userid }, { _id: 0, followers: 1 });

        if (followers.followers.length >= 0) {
            followers.followers.forEach((item) => {
                InsertNotify({
                    recipientId: item,
                    notificationtype: 'Posts',
                    data: data,
                });
            });
        }
        PutNewsFeeds({
            userid,
            insertPosts,
        });
        PutHome({ insertPosts });

        return {
            statusCode: 201,
            message: 'success insert posts',
            data: insertPosts,
        };
    } catch (error) {
        return { error: error };
    }
};

const DeletePosts = async ({ postId }) => {
    try {
        const deletePosts = await _posts.deleteOne({ _id: postId });
        DeleteNotifyPosts({ postId });
        DeleteHome({ postId });
        DeleteNewsFeeds({ postId });
        if (!deletePosts.deletedCount) {
            return {
                statusCode: 404,
                message: `Not Found ${id}`,
            };
        }
        return {
            statusCode: 200,
            message: 'success delete posts',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const InfoPosts = async ({ postsId }) => {
    try {
        const posts = await _posts.findOne({ _id: postsId });
        const userPosts = await _user.findOne({ _id: posts.userid });
        posts.account = userPosts.account;
        const data = {
            ...posts._doc,
            account: userPosts.account,
            nickname: userPosts.nickname,
            avatar: userPosts.avatar,
        };
        if (!posts) {
            return {
                statusCode: 404,
                message: `Not Found: postId ${postsId}`,
            };
        }

        return {
            statusCode: 200,
            message: 'success posts',
            data: data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

module.exports = {
    InsertPosts,
    DeletePosts,
    InfoPosts,
};
