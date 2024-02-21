const _user = require('../models/user.model');
const _group = require('../models/group.model');
const _messagePrivate = require('../models/messagePrivate.model');

//danh những người đã nhắn tin
const ListUserMessage = async ({ userId }) => {
    try {
        const data = [];
        const ReceiverId1s = await _messagePrivate.distinct('receiverId', { senderId: userId });
        const ReceiverId2s = await _messagePrivate.distinct('senderId', { receiverId: userId });
        const ReceiverIds = [...ReceiverId1s, ...ReceiverId2s];
        const uniqueReceiverIds = [...new Set(ReceiverIds)];
        if (uniqueReceiverIds.length > 0) {
            for (const ReceiverId of uniqueReceiverIds) {
                const userReceiver = await _user.findOne({ _id: ReceiverId }, { account: 1, nickname: 1, avatar: 1 });
                data.push(userReceiver);
            }
        }
        return {
            statusCode: 200,
            message: 'success',
            data,
        };
    } catch (error) {
        return { error };
    }
};

//

const ListMessages = async ({ senderId, receiverId }) => {
    try {
        const messagePrivate = await _messagePrivate
            .find({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            })
            .sort({ createdAt: 1 });
        return {
            statusCode: 200,
            message: 'success',
            data: messagePrivate,
        };
    } catch (error) {
        return { error };
    }
};

//tìm tên người muốn nhắn tin
const ReceiverName = async ({ id }) => {
    try {
        const user = await _user.findOne({ _id: id });
        if (!user) {
            return {
                statusCode: 404,
                message: `Not Found: ${id}`,
            };
        }
        return {
            statusCode: 200,
            data: user.fullname,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//tìm tên group muốn nhắn tin
const GroupName = async ({ id }) => {
    try {
        const group = await _group.findOne({ _id: id });
        if (!group) {
            return {
                statusCode: 404,
                message: `Not Found: ${id}`,
            };
        }
        return {
            statusCode: 200,
            data: group.groupname,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//tạo nhóm
const InsertGroup = async ({ groupname, username, userid }) => {
    try {
        await _group.create({
            groupname: groupname,
            member: [
                {
                    username: username,
                    userid: userid,
                    extraPerson: '',
                    position: 'administrators',
                },
            ],
        });
        return {
            statusCode: 201,
            message: 'insert group success',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//danh sách thành viên nhóm
const ListMemberGroup = async ({ groupid }) => {
    try {
        const group = await _group.findOne({ _id: groupid });
        return {
            statusCode: 200,
            message: 'success list member group',
            data: group.member,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//dach sách những người bạn theo hiển thị ra để chọn thêm vào nhóm
const ListAddGroupMember = async ({ userid }) => {
    try {
        const user = await _user.findOne({ _id: userid });
        return {
            statusCode: 200,
            message: 'success list add group member',
            data: user.following,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//thêm thành viên nhóm
const InsertMemberGroup = async ({ userName, username, groupid }) => {
    try {
        const user = await _user.findOne({ fullname: username });

        //tài khoản thành viên cần thêm có tồn tại
        if (!user) {
            return {
                statusCode: 404,
                message: `Not Found: ${username}`,
            };
        }

        await _group.updateOne(
            { _id: groupid },
            {
                $push: {
                    member: {
                        userid: user.id,
                        username: username,
                        extraPerson: userName,
                        position: 'member',
                    },
                },
            },
        );
        return {
            statusCode: 201,
            message: `${username} has just been successfully added by ${userName}`,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//kích thành viên nhóm
const ExpelMembers = async ({ userName, username, groupid }) => {
    try {
        const check = await _group.findOne({
            _id: groupid,
            'member.username': username,
            'member.position': 'administrators',
        });

        if (!check) {
            return {
                statusCode: 403,
                message: 'you are not an administrator',
            };
        }

        await _group.updateOne(
            { _id: groupid },
            {
                $pull: {
                    member: {
                        userid: user.id,
                    },
                },
            },
        );
        return {
            statusCode: 200,
            message: `${userName}just kicked ${username} out of the group`,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//rời nhóm
const LeaveGroup = async ({ username, groupid }) => {
    try {
        await _group.updateOne(
            { _id: groupid },
            {
                $pull: {
                    member: {
                        username: username,
                    },
                },
            },
        );
        return {
            statusCode: 200,
            message: `${username} just left the group`,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//thằng chức lên quản trị viên
const Promote = async ({ userName, username, groupid }) => {
    try {
        const check = await _group.findOne({
            _id: groupid,
            'member.username': userName,
            'member.position': 'administrators',
        });

        if (!check) {
            return {
                statusCode: 403,
                message: 'you are not an administrator',
            };
        }

        await _group.updateOne(
            {
                _id: groupid,
                'member.username': username,
            },
            {
                $set: {
                    'member.$.position': 'administrator',
                },
            },
        );

        return {
            statusCode: 200,
            message: `${userName} just promoted ${username} to administrator`,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

module.exports = {
    ListUserMessage,
    ReceiverName,
    GroupName,
    InsertGroup,
    InsertMemberGroup,
    ExpelMembers,
    LeaveGroup,
    Promote,
    ListMemberGroup,
    ListAddGroupMember,
    ListMessages,
};
