const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const posts = new Schema(
    {
        userid: { type: Schema.Types.ObjectId, required: true },
        content: { type: String, default: '' },
        video: { type: String, required: true },
        emotions: Array,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('post', posts);
