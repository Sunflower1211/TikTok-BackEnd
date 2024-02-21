//chỉ xử lý vấn đề liên quan đến tài khoản như đăng nhập, đăng kí, đăng xuất, ...
const { duplications, insertRegisterUser, insertUser } = require('../services/register.service');

const { createOtp, insertOtp, verifyOtp } = require('../services/OTP.service');

const {
    ForgotPassword,
    ForgotPasswordOtp,
    ForgotPasswordUpdatePassword,
} = require('../services/forgotPassword.service');

const { SendEmailOTP } = require('../services/sendEmail.service');

class account {
    logout(req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            return res.json({
                data: {
                    statusCode: 200,
                    message: 'success',
                },
            });
        });
    }

    login(req, res, next) {
        res.json({
            data: {
                data: {
                    account: req.user.account,
                    nickname: req.user.nickname,
                    sex: req.user.sex,
                    avatar: req.user.avatar,
                    email: req.user.email,
                    following: req.user.following,
                    followers: req.user.followers,
                },
                statusCode: 200,
                message: 'Logged in successfully',
            },
        });
        // res.redirect('/api/home')
    }

    errorLogin(req, res, next) {
        res.json({
            data: {
                statusCode: 401,
                message: 'Wrong account or password',
            },
        });
    }

    //tạo tài khoản
    async register(req, res, next) {
        try {
            const { account, password, email, nickname, sex } = req.body;

            // kiểm tra account, email có trùng trong user không và có trường nào rỗng không
            const { statusCode, message } = await duplications({ account, password, email, nickname, sex });

            if (statusCode && message) {
                const error = new Error(message);
                error.statusCode = statusCode;
                return next(error);
            }

            //lưu thông tin đăng kí tạm thời
            const registerUser = await insertRegisterUser({
                account,
                password,
                email,
                nickname,
                sex,
            });

            //tạo otp
            const otp = await createOtp({});

            //gửi otp về email
            SendEmailOTP({ email, otp });

            //lưu otp vào database
            const checkOtp = await insertOtp({ email, otp });

            if (checkOtp && registerUser) {
                return res.status(201).json({
                    data: {
                        statusCode: 201,
                        message: 'success',
                        data: registerUser,
                    },
                });
            }

            return res.status(400).json({
                statusCode: 400,
                message: 'Bad Request Otp',
            });
        } catch (error) {
            next(error);
        }
    }

    //xác thực tài khoản và tạo tài khoản
    async verifyRegister(req, res, next) {
        try {
            const otp = req.body.otp;
            const email = req.params.email;

            //xác thực otp
            const { statusCode, message } = await verifyOtp({ email, otp });
            if (statusCode && message) {
                const error = new Error(message);
                error.statusCode = statusCode;
                return next(error);
            }

            //lưu user vào database
            const { statusCodeUser, messageUser, data } = await insertUser({ email });

            return res.status(statusCodeUser).json({
                data: {
                    statusCodeUser,
                    messageUser,
                    data,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    //Quên mật khẩu: tìm xem có email ở database không
    async ForgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const { statusCode, message } = await ForgotPassword({ email });
            if (statusCode && message) {
                const error = new Error(message);
                error.statusCode = statusCode;
                return next(error);
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'success forgot password and send email',
                data: email,
            });
        } catch (error) {
            next(error);
        }
    }

    //gửi OTP về xác thực để đặt mật khẩu mới
    async ForgotPasswordOtp(req, res, next) {
        try {
            const { otp } = req.body;
            const email = req.params.email;

            const { statusCode, message } = await ForgotPasswordOtp({ email, otp });

            return res.status(statusCode).json({
                statusCode: statusCode,
                message: message,
            });
        } catch (error) {
            next(error);
        }
    }

    //đặt lại mật khẩu mới
    async ForgotPasswordUpdatePassword(req, res, next) {
        try {
            const { newPassword } = req.body;

            const email = req.params.email;
            const { statusCode, message } = await ForgotPasswordUpdatePassword({ email, newPassword });

            return res.status(statusCode).json({
                statusCode: statusCode,
                message: message,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new account();
