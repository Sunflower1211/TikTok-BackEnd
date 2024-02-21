const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const app = express();
require('express-async-errors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

//socket.io
const { ConnectionPrivate } = require('./src/services/messagePrivate.services');
const { Comment } = require('./src/services/comment.services');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
global._io = io;

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

const store = session.MemoryStore();

app.use(
    session({
        secret: process.env.KEY_SESSION,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        store,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

require('./src/config/mongodb').connect();
helmet.contentSecurityPolicy({
    directives: {
        scriptSrc: ["'self'", "'unsafe-inline'"],
        // Other CSP directives as needed
    },
});
// app.use(morgan('tiny'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use((req, res, next) => {
    if (req.url === '/favicon.ico') {
        res.status(204).end();
    } else {
        next();
    }
});

app.use(require('./src/routes/index'));

const { ReplySocket } = require('./src/services/replies.services');

const messagePrivate = global._io.of('/messagePrivate');
const comment = global._io.of('/comment');
const reply = global._io.of('/reply');

messagePrivate.on('connection', (socket) => {
    console.log('connect message private');
    ConnectionPrivate(socket);
    socket.on('disconnect', async () => {
        console.log('disconnect message private');
    });
});

comment.on('connection', (socket) => {
    console.log('connect comment');
    Comment(socket);
    socket.on('disconnect', async () => {
        console.log('disconnect comment');
    });
});

reply.on('connection', (socket) => {
    console.log('connect reply');
    ReplySocket(socket);
    socket.on('disconnect', async () => {
        console.log('disconnect reply');
    });
});

module.exports = server;
