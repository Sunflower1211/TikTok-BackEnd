const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageGroups = new Schema(
    {
        sendername: { type: String, required: true },
        groupname: { type: String, required: true },
        content: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('messageGroup', messageGroups);
