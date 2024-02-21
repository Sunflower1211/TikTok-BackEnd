const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerUsers = new Schema({
    account: { type: String, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    sex: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 60 * 60 * 60 * 24 } },
});

module.exports = mongoose.model('registerUser', registerUsers);
