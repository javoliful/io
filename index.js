const express = require('express');
const app = express();
const cors = require('cors')
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

app.use(cors());

// TODO: Remove these lines (used to serve any frontend stored in /public)
app.use('/static', express.static('public'));
app.use('/assets', express.static('public/assets'));
app.get('/**', (req, res) => {
    return res.sendFile(path.join(__dirname + '/public/index.html'));
});

// root head
app.head('/', function(req, res){
    console.log('Ping received');
    res.sendStatus(204);
});

// TODO: use REDIS for storing this stuff
let rooms = {};

io.on('connection', socket => {
    console.log('Socket conneted ' + socket.id);

    socket.on('join-room', (roomId, userId, metadata) => {
        userName = metadata && metadata.userName ? metadata.userName: null;
        roomName = metadata && metadata.roomName ? metadata.roomName: null;
        if (rooms[roomId]) {
            roomName = rooms[roomId].roomName;
            rooms[roomId].users.push(userId);
        } else {
            rooms[roomId] = {
                ownerId: userId,
                roomName: roomName,
                users: [userId]
            };
        }

        console.log(`User (${userId}) "${userName}" joined "${roomName}" (${roomId})`);

        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId, { roomName, userName });

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId, { roomName, userName });
            console.log(`User (${userId}) "${userName}" left "${roomName}" (${roomId}) (disconnected)`);
        })

        console.log('Current rooms: ', rooms);
    });

    socket.on('leave-room', (roomId, userId, metadata) => {
        userName = metadata && metadata.userName ? metadata.userName: null;
        roomName = metadata && metadata.roomName ? metadata.roomName: null;
        if (rooms[roomId]) {
            roomName = rooms[roomId].roomName;
            rooms[roomId].users = rooms[roomId].users.filter((id) => id != userId);
        }

        socket.to(roomId).broadcast.emit('user-disconnected', userId, { roomName, userName });
        console.log(`User (${userId}) "${userName}" left "${roomName}" (${roomId})`);

        if(rooms[roomId] && rooms[roomId].users.length == 0){
            delete rooms[roomId];
            console.log('Room deleted because is empty: ', roomId);
        }
        console.log('Current rooms: ', rooms);
    })

    socket.on("disconnect", (reason) => {
        console.log('Socket ' + socket.id + ' disconnected because of: ' + reason);
        console.log('Rooms: ', io.sockets.adapter.rooms);
    });
});

const port = process.env.PORT ? process.env.PORT : 3000;

console.log('Running smartvideo-io in ' + port);
server.listen(port);