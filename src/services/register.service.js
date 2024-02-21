const _user = require('../models/user.model');
const _registerUser = require('../models/registerUser.model');

const duplications = async ({ account, password, email, nickname, sex }) => {
    try {
        const checkSex = ['male', 'female', 'other'];
        const accountUser = await _user.findOne({ account });
        const emailUser = await _user.findOne({ email });

        if (!account || !password || !email || !nickname || !sex) {
            return {
                statusCode: 400,
                message: 'You need to fill in all the information',
            };
        }

        if (password.length < 8) {
            return {
                statusCode: 400,
                message: 'Password must be longer than 8 characters',
            };
        }

        if (!checkSex.includes(sex)) {
            return {
                statusCode: 400,
                message: `no data status ${sex}`,
            };
        }

        if (accountUser) {
            return {
                statusCode: 400,
                message: 'Accout have to unique',
            };
        }
        if (emailUser) {
            return {
                statusCode: 400,
                message: 'Email have to unique',
            };
        }

        return {
            statusCode: null,
            message: null,
        };
    } catch (error) {
        consolog.log(error);
    }
};

const insertRegisterUser = async ({ account, password, email, nickname, sex }) => {
    try {
        const insertRegisterUser = await _registerUser.create({
            account,
            password,
            email,
            nickname,
            sex,
        });
        return insertRegisterUser;
    } catch (error) {
        console.log(error);
    }
};

const insertUser = async ({ email }) => {
    const registerUser = await _registerUser.find({ email: email });
    const lastRegisterUser = registerUser[registerUser.length - 1];
    const user = await _user.create({
        account: lastRegisterUser.account,
        password: lastRegisterUser.password,
        email: lastRegisterUser.email,
        sex: lastRegisterUser.sex,
        nickname: lastRegisterUser.nickname,
    });

    await _registerUser.deleteMany({ email: email });

    return {
        statusCodeUser: 201,
        messageUser: 'success insert user',
        data: user,
    };
};

module.exports = {
    duplications,
    insertUser,
    insertRegisterUser,
};
