const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsfeeds = new Schema({
    userid: { type: Schema.Types.ObjectId, required: true },
    status: { type: Boolean, default: false },
    posts: Object
}, {
    timestamps: true,
});

module.exports = mongoose.model('newsfeed', newsfeeds);