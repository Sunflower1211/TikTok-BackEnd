const express = require('express');
const routes = express.Router();
const message = require('../controllers/message.controller');

routes.post('/insertGroup', message.InsertGroup);
routes.get('/listAddGroupMember/:id', message.ListAddGroupMember);
routes.post('/insertMemberGroup/:id', message.InsertMemberGroup);
routes.delete('/expelMembers/:id', message.ExpelMembers);
routes.delete('/leaveGroup/:id', message.LeaveGroup);
routes.patch('/promote/:id', message.Promote);
routes.get('/listMemberGroup/:id', message.ListMemberGroup);
routes.get('/listMessage/:receiverId', message.ListMessages);
routes.get('/listUserMessage', message.ListUserMessage);

module.exports = routes;
