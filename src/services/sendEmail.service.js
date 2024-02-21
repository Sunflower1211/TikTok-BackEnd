const nodemailer = require('nodemailer');
require('dotenv').config();

const SendEmailOTP = async ({ otp, email }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Mạng xã hội" <ngoluong121102@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'Mã OTP', // Subject line
            text: otp, // plain text body
        });
    }
};

module.exports = {
    SendEmailOTP,
};
