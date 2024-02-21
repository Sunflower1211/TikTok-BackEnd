const _user = require('../models/user.model');
const _posts = require('../models/posts.model');

//thông tin người dùng đăng nhập
const InfoUser = async ({ userId }) => {
    try {
        const infoUser = await _user.findOne({ _id: userId }).select('-password');
        if (!infoUser) {
            return {
                statusCode: 404,
                message: `Not Found: no id ${userId}`,
            };
        }

        return {
            statusCode: 200,
            message: 'success',
            data: infoUser,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//chỉnh sửa trang cá nhân
const EditProfile = async ({ avatar = false, account, nickname, userId }) => {
    try {
        let user;
        if (avatar) {
            user = await _user.updateOne({ _id: userId }, { avatar, account, nickname });
        } else {
            user = await _user.updateOne({ _id: userId }, { account, nickname });
        }
        if ((user.modifiedCount = 0)) {
            return {
                statusCode: 400,
                message: 'update avatar fail',
            };
        }

        return {
            statusCode: 200,
            message: 'update avatar success',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//thay đổi mật khẩu
const EditPassword = async ({ userId, password }) => {
    try {
        const checkPassWord = await _user.findOne({ _id: userId, password: password });
        if (!checkPassWord) {
            return {
                statusCode: 400,
                statusCode: 'Incorrect password',
            };
        }
        const user = await _user.updateOne({ _id: userId }, { password: password });
        if ((user.modifiedCount = 0)) {
            return {
                statusCode: 400,
                message: 'Edit password fail',
            };
        }

        return {
            statusCode: 200,
            message: 'update avatar success',
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//trang cá nhân
const Profile = async ({ accountId }) => {
    try {
        const data = {};
        const profile = await _user.findOne({ account: accountId }).select('-password');
        const posts = await _posts.find({ userid: profile._id }).sort({ createdAt: -1 });
        if (!profile) {
            return {
                statusCode: 404,
                message: `not found profile ${accountId}`,
            };
        }

        data.profile = profile;
        data.posts = posts;

        return {
            statusCode: 200,
            message: `success get profile ${accountId}`,
            data,
        };
    } catch (error) {
        return { error };
    }
};

module.exports = {
    InfoUser,
    EditProfile,
    EditPassword,
    Profile,
};
