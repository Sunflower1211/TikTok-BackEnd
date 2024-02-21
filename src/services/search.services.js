const _user = require('../models/user.model');

const SearchLessAccount = async ({ query }) => {
    try {
        const searchAccount = await _user
            .find({
                $or: [{ account: { $regex: query, $options: 'i' } }, { nickname: { $regex: query, $options: 'i' } }],
            })
            .limit(5)
            .select('-password');

        return {
            data: searchAccount,
        };
    } catch (error) {
        return { error };
    }
};

const SearchMoreAccount = async ({ query }) => {
    try {
        const searchAccount = await _user
            .find({
                $or: [{ account: { $regex: query, $options: 'i' } }, { nickname: { $regex: query, $options: 'i' } }],
            })
            .limit(20)
            .select('-password');

        return {
            data: searchAccount,
        };
    } catch (error) {
        return { error };
    }
};

module.exports = { SearchLessAccount, SearchMoreAccount };
