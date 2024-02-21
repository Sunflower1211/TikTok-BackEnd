//xử lý tin nhắn người dùng chưa đọc

const { ListMessagePrivate, ListMessageGroup } = require('../services/notifyMessage.services');

class NotifyMessage {
    //danh sách những người nhắn tin với người dùng hiện tại
    async ListMessagePrivate(req, res, next) {
        const username = req.user.fullname;

        const { statusCode, message, data, error } = await ListMessagePrivate({ username });

        if (error) {
            return next(error);
        }

        return res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            data: data,
        });
    }

    //danh sách những nhóm người dùng hiện tại tham gia
    async ListMessageGroup(req, res, next) {
        const username = req.user.fullname;

        const { statusCode, message, data, error } = await ListMessageGroup({ username });

        if (error) {
            return next(error);
        }

        return res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            data: data,
        });
    }
}

module.exports = new NotifyMessage();
