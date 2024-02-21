//xử lý liên quan đến comment

const { DeleteComment, ListComment } = require('../services/comment.services');

class Comment {
    //lấy danh sách comment
    async ListComment(req, res, next) {
        const postsId = req.params.postsId;
        const { statusCode, message, data, error } = await ListComment({ postsId });

        if (error) {
            return next(error);
        }

        if (!data) {
            const error = new Error(message);
            error.statusCode = statusCode;
            return next(error);
        }

        res.status(statusCode).json({
            data: {
                statusCode,
                message,
                data,
            },
        });
    }
}

module.exports = new Comment();
