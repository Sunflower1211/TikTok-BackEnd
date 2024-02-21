const _comment = require('../models/comment.model');
const _user = require('../models/user.model');

const { InsertNotify, DeleteNotifyReplie } = require('../services/notify.services');

const ReplySocket = (socket) => {
    //join vào phòng
    socket.on('user connection', async (commentId) => {
        socket.join(commentId);
    });

    //thoát vào phòng
    socket.on('user disconnect', async (commentId) => {
        console.log('out ' + commentId);
    });

    //reply
    socket.on('send content reply', async ({ commentId, content, userId }) => {
        const comment = await _comment.findOne({ _id: commentId });
        let replyId = 0;
        if (comment.replies.length >= 1) {
            replyId = comment.replies[comment.replies.length - 1].replyId + 1;
        }
        const reply = {
            content,
            replyId,
            userId,
        };

        await _comment.updateOne({ _id: commentId }, { $push: { replies: reply } });

        const user = await _user.findOne({ _id: userId }, { account: 1, nickname: 1, avatar: 1, _id: 0 });
        const replyContent = {
            ...reply,
            ...user._doc,
            commentId,
        };
        _io.of('/reply').to(commentId).emit('content reply', replyContent);
    });

    //delete reply
    socket.on('delete reply', async ({ commentId, replyId }) => {
        console.log(commentId);
        console.log(replyId);
        const replieIdNumber = parseInt(replyId, 10);

        await _comment.updateOne(
            { _id: commentId },
            {
                $pull: {
                    replies: {
                        replyId: replieIdNumber,
                    },
                },
            },
        );
        _io.of('/reply').to(commentId).emit('delete reply', { commentId, replyId });
    });
};

const InsertReplie = async ({ userId, userName, commentId, contentReplie, userAvatar }) => {
    try {
        const comment = await _comment.findOne({ _id: commentId });
        if (!comment) {
            return {
                statusCode: 404,
                message: `Not Found: commentId ${commentId}`,
            };
        }

        var replieId = 0;
        if (comment.replies.length >= 1) {
            replieId = comment.replies[comment.replies.length - 1].ReplieId + 1;
        }

        const replie = {
            commentId: comment.id,
            replieId: replieId,
            userId: userId.toString(),
        };

        const insertReplie = await _comment.updateOne({ _id: commentId }, { $push: { replies: replie } });
        if (insertReplie.modifiedCount === 0) {
            return {
                statusCode: 400,
                message: 'Insert replie failed',
            };
        }

        const data = {
            commentId: comment.id,
            replieId: replieId,
            userIdReplie: userId.toString(),
            userNameReplie: userName,
            content: contentReplie,
        };

        InsertNotify({
            recipientId: comment.userid,
            notificationtype: 'New Replie',
            data: data,
        });

        return {
            statusCode: 201,
            message: 'Insert replie success',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const DeleteReplie = async ({ userId, replieId, commentId }) => {
    try {
        if (!replieId) {
            return {
                statusCode: 404,
                message: `Not found: replieId ${replieId}`,
            };
        }
        const checkComment = await _comment.findOne({ _id: commentId });
        if (!checkComment) {
            return {
                statusCode: 404,
                message: `Not Found: commentId ${commentId}`,
            };
        }

        const replieIdNumber = parseInt(replieId, 10);

        const DeleteReplie = await _comment.updateOne(
            { _id: commentId },
            {
                $pull: {
                    replies: {
                        userId: userId.toString(),
                        replieId: replieIdNumber,
                    },
                },
            },
        );

        if (DeleteReplie.modifiedCount === 0) {
            return {
                statusCode: 400,
                message: 'delete replie failed',
            };
        }

        DeleteNotifyReplie({ commentId, replieId });
        return {
            statusCode: 200,
            message: 'Delete replie success',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const ListReplies = async ({ commentId }) => {
    try {
        let data = [];
        const comment = await _comment.findOne({ _id: commentId });
        if (!comment) {
            return {
                statusCode: 404,
                message: `Not Found: commentId ${commentId}`,
            };
        }
        for (const item of comment.replies) {
            const user = await _user.findOne({ _id: item.userId }, { account: 1, nickname: 1, avatar: 1, _id: 0 });
            const replyContent = {
                ...item,
                ...user._doc,
                commentId,
            };
            data.unshift(replyContent);
        }

        return {
            statusCode: 200,
            message: 'success list replie',
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

module.exports = {
    ReplySocket,
    InsertReplie,
    DeleteReplie,
    ListReplies,
};
