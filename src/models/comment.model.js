const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const comments = new Schema(
    {
        userid: { type: Schema.Types.ObjectId, required: true },
        postsid: { type: Schema.Types.ObjectId, required: true },
        content: { type: String, required: true },
        replies: Array,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('comment', comments);
