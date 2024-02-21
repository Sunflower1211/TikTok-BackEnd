//xử lý những trả lời xủa comment

const { InsertReplie, DeleteReplie, ListReplies } = require('../services/replies.services');

class Replie {
    //tạo câu trả lời mới cho comment
    async InsertReplie(req, res, next) {
        const userId = req.user._id;
        const userName = req.user.fullname;
        const userAvatar = req.user.avatar;
        const commentId = req.params.commentId;
        const contentReplie = req.body.contentReplie;

        const { statusCode, message, error } = await InsertReplie({
            userId,
            userName,
            commentId,
            contentReplie,
            userAvatar,
        });

        if (error) {
            return next(error);
        }

        if (statusCode != 201) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        return res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //xóa câu trả lời
    async DeleteReplie(req, res, next) {
        const userId = req.user._id;
        const replieId = req.params.repliesId;
        const commentId = req.params.commentId;
        const { statusCode, message, error } = await DeleteReplie({
            userId,
            replieId,
            commentId,
        });

        if (error) {
            return next(error);
        }

        if (statusCode != 200) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        return res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //danh sách câu trả lời của một comment
    async ListReplies(req, res, next) {
        const commentId = req.params.commentId;

        const { statusCode, message, data, error } = await ListReplies({ commentId });

        if (error) {
            return next(error);
        }

        if (!data) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        return res.status(statusCode).json({
            data: {
                statusCode,
                message,
                data,
            },
        });
    }
}

module.exports = new Replie();
