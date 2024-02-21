const _OTP = require('../models/otp.model');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');

const createOtp = async ({}) => {
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    return otp;
};

const insertOtp = async ({ email, otp }) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashotp = await bcrypt.hash(otp, salt);
        const Otp = await _OTP.create({
            email: email,
            otp: hashotp,
        });
        return Otp;
    } catch (error) {
        console.log(error);
    }
};

const verifyOtp = async ({ email, otp }) => {
    try {
        if (!email) {
            return {
                statusCode: 400,
                message: 'you need to fill in email data',
            };
        }

        if (!otp) {
            return {
                statusCode: 400,
                message: 'you need to fill in email otp',
            };
        }
        const otpHolder = await _OTP.find({ email: email });

        if (!otpHolder.length) {
            return {
                statusCode: 404,
                message: 'expired OTP',
            };
        }

        const lastOtp = otpHolder[otpHolder.length - 1];

        const isvalid = await bcrypt.compare(otp, lastOtp.otp);

        if (!isvalid) {
            return {
                statusCode: 401,
                message: 'invalid OTP',
            };
        }

        if (isvalid && email === lastOtp.email) {
            await _OTP.deleteMany({ email: email });
            return {
                statusCode: null,
                message: null,
            };
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createOtp,
    insertOtp,
    verifyOtp,
};
