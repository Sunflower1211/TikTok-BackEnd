//trang cá nhân của người dùng

const { InfoUser, EditProfile, EditPassword, Profile } = require('../services/user.services');

class User {
    //thông tin của người dùng
    async InfoUser(req, res, next) {
        const userId = req.user._id;
        const { statusCode, message, data, error } = await InfoUser({ userId });
        if (error) {
            next(error);
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

    //sửa profile
    async EditProfile(req, res, next) {
        const { account, nickname } = req.body;

        let avatar;
        if (req.file) {
            const filename = req.file.filename;
            avatar = `images/${filename}`;
        }
        const userId = req.user._id;
        const { statusCode, message, error } = await EditProfile({ avatar, account, nickname, userId });
        if (error) {
            next(error);
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
            },
        });
    }

    //đổi mật khẩu
    async EditPassword(req, res, next) {
        const userId = req.user._id;
        const password = req.body.password;
        const { statusCode, message, error } = await EditPassword({ userId, password });
        if (error) {
            next(error);
        }

        if (statusCode != 200) {
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

    //trang cá nhân
    async Profile(req, res, next) {
        const accountId = req.params.accountId;
        const { data, statusCode, message, error } = await Profile({ accountId });
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

module.exports = new User();
