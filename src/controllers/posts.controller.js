//xử lý các bài viết

const { InsertPosts, DeletePosts, InfoPosts } = require('../services/posts.service');

class Posts {
    //tạo bài viết mới
    async InsertPosts(req, res, next) {
        const { content } = req.body;

        const filename = req.file.filename;
        const video = `videos/${filename}`;

        const userid = req.user._id;

        const { statusCode, message, data, error } = await InsertPosts({
            userid,
            content,
            video,
        });

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

    async DeletePosts(req, res, next) {
        const postId = req.params.postId;
        const { statusCode, message, error } = await DeletePosts({ postId });
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
            },
        });
    }

    async InfoPosts(req, res, next) {
        const postsId = req.params.postsId;

        const { statusCode, message, data, error } = await InfoPosts({ postsId });

        if (error) {
            return next(error);
        }

        if (statusCode != 200) {
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

module.exports = new Posts();
