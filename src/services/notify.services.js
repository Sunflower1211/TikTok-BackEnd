const _notify = require('../models/notify.model');
const _user = require('../models/user.model');
const { ObjectId } = require('mongodb');

//dung chung
const getData = async ({ userId, notificationtype = '' }) => {
    const data = [];
    const listNotify = await _notify
        .find({ recipientid: userId, notificationtype: notificationtype }, { iscompleted: 0 })
        .sort({ createdAt: -1 });
    if (listNotify.length > 0) {
        for (const item of listNotify) {
            const user = await _user.findOne({ _id: item.data.userId }, { account: 1, nickname: 1, avatar: 1 });
            const notify = {
                user: { ...user._doc },
                notificationtype: item.notificationtype,
                postsId: item.data.postsId,
                _id: item._id,
            };
            data.push(notify);
        }
    }
    return {
        statusCode: 200,
        message: 'success list notify',
        data,
    };
};

///

const InsertNotify = async ({ recipientId, notificationtype, data }) => {
    try {
        await _notify.create({
            recipientid: recipientId,
            notificationtype: notificationtype,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
};

const DeleteNotifyPosts = async ({ id }) => {
    try {
        await _notify.deleteMany({ 'data.postsId': id });
    } catch (error) {
        console.log(error);
    }
};

const DeleteNotifyComment = async ({ commentId }) => {
    try {
        const objectId = new ObjectId(commentId);
        await _notify.deleteMany({ 'data.commentId': objectId });
    } catch (error) {
        console.log(error);
    }
};

const DeleteNotifyReplie = async ({ commentId, replieId }) => {
    try {
        const replieIdNumber = parseInt(replieId, 10);
        await _notify.deleteMany({ 'data.commentId': commentId, 'data.replieId': replieIdNumber });
    } catch (error) {
        console.log(error);
    }
};

const ListAllNotify = async ({ userId }) => {
    try {
        const listNotify = await _notify.find({ recipientid: userId }, { iscompleted: 0 }).sort({ createdAt: -1 });
        await _notify.updateMany({ iscompleted: false, recipientid: userId }, { iscompleted: true });
        if (listNotify.length <= 0) {
            return {
                statusCode: 404,
                message: 'not found notification',
            };
        }

        const data = [];

        for (const item of listNotify) {
            const user = await _user.findOne({ _id: item.data.userId }, { account: 1, nickname: 1, avatar: 1 });
            const notify = {
                user: { ...user._doc },
                notificationtype: item.notificationtype,
                postsId: item.data.postsId,
                _id: item._id,
            };
            data.push(notify);
        }
        return {
            statusCode: 200,
            message: 'success list notify',
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const ListNotifyPosts = async ({ userId }) => {
    try {
        const { statusCode, message, data } = await getData({ userId, notificationtype: 'Posts' });
        return {
            statusCode,
            message,
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const ListNotifyComment = async ({ userId }) => {
    try {
        const { statusCode, message, data } = await getData({ userId, notificationtype: 'Comment' });
        return {
            statusCode,
            message,
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const ListNotifyFollower = async ({ userId }) => {
    try {
        const { statusCode, message, data } = await getData({ userId, notificationtype: 'Follwer' });
        return {
            statusCode,
            message,
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

const CountUnreadNotify = async ({ userId }) => {
    try {
        const countUnreadNotify = await _notify.countDocuments({ iscompleted: false, recipientid: userId });
        return {
            statusCode: 200,
            message: 'success',
            data: countUnreadNotify,
        };
    } catch (error) {
        return { error };
    }
};

module.exports = {
    InsertNotify,
    ListNotifyPosts,
    ListNotifyFollower,
    ListNotifyComment,
    ListAllNotify,
    DeleteNotifyPosts,
    DeleteNotifyComment,
    DeleteNotifyReplie,
    CountUnreadNotify,
};
