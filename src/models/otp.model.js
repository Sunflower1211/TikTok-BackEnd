const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otps = new Schema({
    otp: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 60 } }
});

module.exports = mongoose.model('otp', otps);