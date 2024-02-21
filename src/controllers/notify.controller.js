//xử lý thông báo các bài viết mới, comment mới, ...

const {
    ListAllNotify,
    ListNotifyPosts,
    ListNotifyComment,
    ListNotifyFollower,
    CountUnreadNotify,
} = require('../services/notify.services');

class Notify {
    //danh sách thông báo ví dụ: có người like bài viết của user, ...
    async ListAllNotify(req, res, next) {
        const userId = req.user._id;
        const { statusCode, message, data, error } = await ListAllNotify({ userId });
        if (error) {
            return next(error);
        }

        if (statusCode != 200) {
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

    async ListNotifyPosts(req, res, next) {
        const userId = req.user._id;
        const { statusCode, message, data, error } = await ListNotifyPosts({ userId });
        if (error) {
            return next(error);
        }

        if (statusCode != 200) {
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

    async ListNotifyComment(req, res, next) {
        const userId = req.user._id;
        const { statusCode, message, data, error } = await ListNotifyComment({ userId });
        if (error) {
            return next(error);
        }

        if (statusCode != 200) {
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

    async ListNotifyFollower(req, res, next) {
        const userId = req.user._id;
        const { statusCode, message, data, error } = await ListNotifyFollower({ userId });
        if (error) {
            return next(error);
        }

        if (statusCode != 200) {
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

    async CountUnreadNotify(req, res, next) {
        const userId = req.user._id;
        const { statusCode, message, data, error } = await CountUnreadNotify({ userId });
        if (error) {
            return next(error);
        }

        if (statusCode != 200) {
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

module.exports = new Notify();
