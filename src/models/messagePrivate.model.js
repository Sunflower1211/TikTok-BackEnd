const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messagePrivates = new Schema(
    {
        senderId: { type: String, required: true },
        receiverId: { type: String, required: true },
        content: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('messagePrivate', messagePrivates);
