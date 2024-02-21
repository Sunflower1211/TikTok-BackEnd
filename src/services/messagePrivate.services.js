const _user = require('../models/user.model');
const _messagePrivate = require('../models/messagePrivate.model');

const ConnectionPrivate = (socket) => {
    //cập nhật dữ liệu trong mongodb trường socketid và isonline
    socket.on('user connection', async (senderId) => {
        await _user.updateOne({ _id: senderId }, { socketid: socket.id });
    });

    //nhắn tin
    socket.on('chat message', async ({ senderId, receiverId, content }) => {
        console.log(content);
        const userReceiver = await _user.findOne({ _id: receiverId });
        await _messagePrivate.create({
            senderId,
            receiverId,
            content,
        });
        socket.to(userReceiver.socketid).emit('chat message', { content, senderId });
        socket.emit('chat message', { content, senderId });
    });
};

module.exports = { ConnectionPrivate };
