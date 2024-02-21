const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const users = new Schema(
    {
        account: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        nickname: { type: String, required: true },
        socketid: { type: String, default: '' },
        sex: { type: String, required: true },
        tick: { type: Boolean, default: false },
        avatar: { type: String, default: '/images/TikTok1037030400.png' },
        email: { type: String, required: true, unique: true },
        facebook_url: { type: String, default: '' },
        following: Array,
        followers: Array,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('user', users);
