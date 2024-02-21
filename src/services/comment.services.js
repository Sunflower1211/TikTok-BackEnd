const _comment = require('../models/comment.model');
const _posts = require('../models/posts.model');
const _user = require('../models/user.model');

const { InsertNotify, DeleteNotifyComment } = require('../services/notify.services');
const { ObjectId } = require('mongodb');

const Comment = (socket) => {
    //join vào phòng
    socket.on('user connection', async (postsId) => {
        socket.join(postsId);
    });

    //comment
    socket.on('send-content-comment', async ({ userId, postsId, contentComment }) => {
        const inserComment = await _comment.create({
            userid: userId,
            postsid: postsId,
            content: contentComment,
        });
        const posts = await _posts.findOne({ _id: postsId });
        const user = await _user.findOne({ _id: userId }, { account: 1, nickname: 1, avatar: 1, _id: 0 });
        const comment = {
            ...user._doc,
            ...inserComment._doc,
        };
        const data = {
            commentId: inserComment._id,
            userId,
            postsId,
        };

        InsertNotify({
            recipientId: posts.userid,
            notificationtype: 'Comment',
            data: data,
        });
        _io.of('/comment').to(postsId).emit('content comment', comment);
    });

    //delete comment
    socket.on('delete-comment', async ({ commentId, postsId }) => {
        await _comment.deleteOne({ _id: commentId });
        DeleteNotifyComment({ commentId });
        _io.of('/comment').to(postsId).emit('delete-comment', { commentId });
    });
};

const ListComment = async ({ postsId }) => {
    try {
        const data = [];
        const listComment = await _comment.find({ postsid: postsId }).sort({ createdAt: -1 });
        if (listComment.length > 0) {
            for (const item of listComment) {
                const user = await _user.findOne({ _id: item.userid }, { account: 1, nickname: 1, avatar: 1, _id: 0 });
                const comment = {
                    ...item._doc,
                    ...user._doc,
                };
                data.push(comment);
            }
        }

        if (!listComment) {
            return {
                statusCode: 404,
                message: `Not Found: ${postsId}`,
            };
        }

        return {
            statusCode: 200,
            message: 'success list comment',
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

module.exports = {
    ListComment,
    Comment,
};
