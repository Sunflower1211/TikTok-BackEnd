//xử lý liên quan đến việc nhắn tin

const {
    InsertGroup,
    InsertMemberGroup,
    ExpelMembers,
    LeaveGroup,
    Promote,
    ListMemberGroup,
    ListAddGroupMember,
    ListUserMessage,
    ListMessages,
} = require('../services/message.services');

class Message {
    //danh những người đã nhắn tin
    async ListUserMessage(req, res, next) {
        const userId = req.user._id;
        const { statusCode, message, data, error } = await ListUserMessage({ userId });
        if (error) {
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

    //
    async ListMessages(req, res, next) {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const { statusCode, message, data, error } = await ListMessages({ senderId, receiverId });
        if (error) {
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

    //tạo nhóm
    async InsertGroup(req, res, next) {
        const groupname = req.body.groupname;
        const username = req.user.fullname;
        const userid = req.user.id;

        const { statusCode, message, error } = await InsertGroup({ groupname, username, userid });
        if (error) {
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //danh sách thành viên nhóm
    async ListMemberGroup(req, res, next) {
        const groupid = req.params.id;

        const { statusCode, message, data, error } = await ListMemberGroup({ groupid });

        if (error) {
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            data: data,
        });
    }

    //dach sách những người bạn theo hiển thị ra để chọn thêm vào nhóm
    async ListAddGroupMember(req, res, next) {
        const userid = req.user.id;
        const groupid = req.params.id;

        const { statusCode, message, data, error } = await ListAddGroupMember({ userid });

        if (error) {
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            groupid: groupid,
            data: data,
        });
    }

    //thêm thành viên vào nhóm
    async InsertMemberGroup(req, res, next) {
        //username người dùng hiện tại
        const userName = req.user.fullname;
        //username người được thêm vào nhóm
        const username = req.body.username;
        const groupid = req.params.id;

        const { statusCode, message, error } = await InsertMemberGroup({ userName, username, groupid });

        if (error) {
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //kích thành viên khỏi nhóm
    async ExpelMembers(req, res, next) {
        //username người dùng hiện tại
        const userName = req.user.fullname;
        //username người bị đuổi khỏi nhóm
        const username = req.body.username;
        const groupid = req.params.id;

        const { statusCode, message, error } = await ExpelMembers({ userName, username, groupid });

        if (error) {
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //rời nhóm
    async LeaveGroup(req, res, next) {
        const username = req.user.fullname;
        const groupid = req.params.id;
        const { statusCode, message, error } = await LeaveGroup({ username, groupid });

        if (error) {
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }

    //thăng chức quản trị viên
    async Promote(req, res, next) {
        //username người dùng hiện tại
        const userName = req.user.fullname;
        //username người bị đuổi khỏi nhóm
        const username = req.body.username;
        const groupid = req.params.id;

        const { statusCode, message, error } = await Promote({ userName, username, groupid });

        if (error) {
            return next(error);
        }

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }
}

module.exports = new Message();
