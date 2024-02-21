//xử lý cảm xúc của bài viết

const { InsertEmotions, DeleteEmotions, ListEmotions } = require('../services/emotions.services');

class Emotions {
    //tạo cảm xúc bài viết
    async InsertEmotions(req, res, next) {
        const postsId = req.params.postsId;
        const userId = req.user._id;
        const userName = req.user.fullname;
        const userAvatar = req.user.avatar;
        const { statusCode, message, error } = await InsertEmotions({ postsId, userId, userName, userAvatar });

        if (error) {
            next(error);
        }

        if (statusCode === 403) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        if (statusCode === 404) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //xóa cảm xúc
    async DeleteEmotions(req, res, next) {
        const postsId = req.params.postsId;
        const userId = req.user._id;
        const { statusCode, message, error } = await DeleteEmotions({ postsId, userId });

        if (error) {
            next(error);
        }

        if (statusCode === 403) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        if (statusCode === 404) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //danh sách cảm xúc của bài viết
    async ListEmotions(req, res, next) {
        const postsId = req.params.postsId;

        const { statusCode, message, data, error } = await ListEmotions({ postsId });

        if (error) {
            next(error);
        }

        if (!data) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            data: data,
        });
    }
}

module.exports = new Emotions();
