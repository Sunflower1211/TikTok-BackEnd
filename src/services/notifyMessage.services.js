const _messagePrivate = require('../models/messagePrivate.model');
const _user = require('../models/user.model');
const _group = require('../models/group.model');

const ListMessagePrivate = async ({ username }) => {
    try {
        // Lấy danh sách người đã nhắn tin với người dùng hiện tại
        const sendernames = await _messagePrivate.distinct('sendername', { receivername: username });
        const receivernames = await _messagePrivate.distinct('receivername', { sendername: username });

        // Gộp danh sách và loại bỏ các giá trị trùng lặp
        const allUserNames = Array.from(new Set([...sendernames, ...receivernames]));

        const listMessagePrivates = await _user.find({ fullname: { $in: allUserNames } }, { _id: 1, fullname: 1 });

        return {
            statusCode: 200,
            message: 'success get list',
            data: listMessagePrivates,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const ListMessageGroup = async ({ username }) => {
    try {
        // Lấy danh sách những nhóm người dùng hiện tại tham gia
        const listGroup = await _group.find(
            { member: { $elemMatch: { username: username } } },
            { _id: 1, groupname: 1 },
        );

        return {
            statusCode: 200,
            message: 'success get list group',
            data: listGroup,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

module.exports = {
    ListMessagePrivate,
    ListMessageGroup,
};
