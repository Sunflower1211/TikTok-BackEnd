const _posts = require('../models/posts.model');
const _newsfeeds = require('../models/newsfeeds.model');
const _home = require('../models/home.model');
const ObjectId = require('mongodb').ObjectId;

const InsertEmotions = async ({ postsId, userId }) => {
    try {
        const posts = await _posts.findOne({ _id: postsId });
        const userExists = posts.emotions.includes(userId);
        if (userExists) {
            return {
                statusCode: 403,
                message: `Forbidden: ${userId} had`,
            };
        }

        const insertEmotions = await _posts.updateOne({ _id: postsId }, { $push: { emotions: userId } });

        if ((insertEmotions.modifiedCount = 0)) {
            return {
                statusCode: 404,
                message: `Not Found: ${userId}`,
            };
        }

        const targetPostId = new ObjectId(postsId);

        await _home.updateMany({ 'posts._id': targetPostId }, { $push: { 'posts.emotions': userId } });
        await _newsfeeds.updateMany({ 'posts._id': targetPostId }, { $push: { 'posts.emotions': userId } });

        return {
            statusCode: 201,
            message: 'success insert emotions',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const DeleteEmotions = async ({ postsId, userId }) => {
    try {
        const insertEmotions = await _posts.updateOne({ _id: postsId }, { $pull: { emotions: userId } });

        if ((insertEmotions.modifiedCount = 0)) {
            return {
                statusCode: 404,
                message: `Not Found: ${userId}`,
            };
        }

        const targetPostId = new ObjectId(postsId);

        await _home.updateMany({ 'posts._id': targetPostId }, { $pull: { 'posts.emotions': userId } });

        await _newsfeeds.updateMany({ 'posts._id': targetPostId }, { $pull: { 'posts.emotions': userId } });

        return {
            statusCode: 200,
            message: 'success delete emotions',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};
module.exports = {
    InsertEmotions,
    DeleteEmotions,
};
