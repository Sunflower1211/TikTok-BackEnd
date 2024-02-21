const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groups = new Schema({
    groupname: { type: String, required: true, unique: true },
    member: { type: Array, default: [] }
}, {
    timestamps: true,
});

module.exports = mongoose.model('group', groups);