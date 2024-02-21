const _user = require('../models/user.model');
const { createOtp, insertOtp, verifyOtp } = require('./OTP.service');

const { SendEmailOTP } = require('../services/sendEmail.service');

const ForgotPassword = async ({ email }) => {
    const checkEmail = CheckEmail({ email });
    if (!checkEmail) {
        return {
            statusCode: 404,
            message: 'Not Found',
        };
    }

    //tạo otp
    const otp = await createOtp({});

    //gửi otp về email
    await SendEmailOTP({ email, otp });

    //lưu otp
    await insertOtp({ email, otp });

    return {
        statusCode: null,
        message: null,
    };
};

const CheckEmail = async ({ email }) => {
    try {
        const checkEmail = await _user.findOne({ email: email });
        return checkEmail ? true : false;
    } catch (error) {
        console.log(error);
    }
};

const ForgotPasswordOtp = async ({ email, otp }) => {
    const { statusCode, message } = await verifyOtp({ email, otp });
    if (statusCode && message) {
        const error = new Error(message);
        error.statusCode = statusCode;
        return next(error);
    }

    return {
        statusCode: 200,
        message: 'success verify otp',
    };
};

const ForgotPasswordUpdatePassword = async ({ email, newPassword }) => {
    try {
        const updatePassword = await _user.updateOne({ email: email }, { password: newPassword });
        if (updatePassword) {
            return {
                statusCode: 200,
                message: 'success update password',
            };
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    ForgotPassword,
    ForgotPasswordOtp,
    ForgotPasswordUpdatePassword,
};
