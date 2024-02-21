const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const homes = new Schema({
    userid: { type: Schema.Types.ObjectId, required: true },
    status: { type: Boolean, default: false },
    posts: Object
}, {
    timestamps: true,
});

module.exports = mongoose.model('home', homes);