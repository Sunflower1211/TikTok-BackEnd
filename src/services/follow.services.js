const _user = require('../models/user.model');
const { InsertNotify } = require('./notify.services');

const InsertFollow = async ({ userId, userFollowId }) => {
    try {
        const checkFollowing = await _user.findOne({ _id: userId });
        const checkFollowers = await _user.findOne({ _id: userFollowId });

        if (checkFollowing.following.includes(userFollowId)) {
            return {
                statusCode: 403,
                message: `Forbidden: you are already following ${userFollowId}`,
            };
        }
        if (checkFollowers.followers.includes(userId)) {
            return {
                statusCode: 403,
                message: `Forbidden: This ${userFollowId} is already tracking you`,
            };
        }

        await _user.updateOne({ _id: userId }, { $push: { following: { $each: [userFollowId], $position: 0 } } });
        await _user.updateOne({ _id: userFollowId }, { $push: { followers: userId } });
        console.log(1);

        const data = {
            userId: userId,
        };

        InsertNotify({
            recipientId: userFollowId,
            notificationtype: 'Follwer',
            data: data,
        });
        console.log(2);

        return {
            statusCode: 201,
            message: 'success insert follow',
        };
    } catch (error) {
        return {
            error,
        };
    }
};

const DeleteFollow = async ({ userId, userFollowId }) => {
    try {
        const checkFollowing = await _user.findOne({ _id: userId });
        const checkFollowers = await _user.findOne({ _id: userFollowId });

        if (checkFollowers && checkFollowing) {
            await _user.updateOne({ _id: userId }, { $pull: { following: userFollowId } });
            await _user.updateOne({ _id: userFollowId }, { $pull: { followers: userId } });

            return {
                statusCode: 200,
                message: 'success delete follow',
            };
        }

        return {
            statusCode: 404,
            message: 'Not Found',
        };
    } catch (error) {
        return {
            error,
        };
    }
};

//danh sách những người mà userId truyền vào đang theo dõi
const ListFollowingDetail = async ({ userId }) => {
    try {
        const listFollowing = await _user.findOne({ _id: userId }, { _id: 0, following: 1 });
        const data = [];
        for (const item of listFollowing.following) {
            const follow = await _user.findOne({ _id: item }).select('account nickname tick avatar');
            data.push(follow);
        }

        if (!listFollowing) {
            return {
                statusCode: 404,
                message: `Not Found: id ${userId} not found`,
            };
        }

        return {
            statusCode: 200,
            message: 'success list following',
            data,
        };
    } catch (error) {
        return {
            error,
        };
    }
};

//danh những người theo dõi người dùng hiện tại
const ListFollowers = async ({ userId }) => {
    try {
        const listFollowers = await _user.findOne({ _id: userId }, { _id: 0, followers: 1 });

        const data = [];
        for (const item of listFollowers.followers) {
            const follow = await _user.findOne({ _id: item }).select('account nickname tick avatar');
            data.push(follow);
        }

        if (!listFollowers) {
            return {
                statusCode: 404,
                message: `Not Found: id ${userId} not found`,
            };
        }

        return {
            statusCode: 200,
            message: 'success list following',
            data,
        };
    } catch (error) {
        return {
            error,
        };
    }
};

module.exports = {
    InsertFollow,
    DeleteFollow,
    ListFollowingDetail,
    ListFollowers,
};
