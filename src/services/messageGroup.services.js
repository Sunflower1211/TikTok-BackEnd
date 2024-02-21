const _messageGroup = require('../models/messageGroup.model');

const ConnectionGroup = async (socket) => {
    socket.on('create room', async (groupName) => {
        //tạo hoặc thêm vào nhóm chát
        socket.join(groupName);
        // console.log(socket.adapter.rooms);

        //hiển thị ra tin nhắn cũ với đối tượng nhận tin nhắn
        socket.on('show message group', async (groupname) => {
            const messageGroup = await _messageGroup.find({ groupname: groupname }).sort({ createdAt: 1 });
            _io.emit('show message group', messageGroup);
        });

        //nhắn tin nhóm
        socket.on('chat message group', async (sendername, groupname, content) => {
            await _messageGroup.create({
                sendername,
                groupname,
                content,
            });
            _io.to(groupname).emit('chat message group', content, sendername);
        });
    });
};

module.exports = { ConnectionGroup };
