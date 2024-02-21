const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notifys = new Schema(
    {
        recipientid: { type: Schema.Types.ObjectId, required: true }, //id người nhận thông báo
        notificationtype: { type: String, required: true }, //chỉ định loại thông báo
        iscompleted: { type: Boolean, default: false }, //đã xem thông báo
        data: Object, //lưu những thứ ví dụ như ai đăng bài, ai comment, ai like ...
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('notify', notifys);
