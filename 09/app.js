//jshint node: true, esversion: 6
const moment = require('moment');
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

const heartBeat = 5000;

const chatHistory = {
  chat: [],
};

const connectedUsers = {};

const getChatState = (name) => {
  return {
    history: chatHistory[name],
    users: Object.keys(connectedUsers).filter((userName) => connectedUsers[userName]),
    heartbeat: heartBeat,
    rooms: Object.keys(chatHistory),
  }
};

const manageSocket = (name) => {
  if (chatHistory[name] === undefined) {
    chatHistory[name] = [];
  }
  io
    .of(`/${name}`)
    .on('connect', (socket) => {
      socket.emit('chatStatus', getChatState(name));
      socket.heartbeat = setTimeout(() => {
        const {userName} = socket;
        if (userName) {
          connectedUsers[userName] = false;
          socket.broadcast.emit('userDisconnected', userName);
          socket.disconnect();
        }
      }, heartBeat * 2);
      socket.on('heartbeat', () => {
        clearTimeout(socket.heartbeat);
        socket.heartbeat = setTimeout(() => {
          const {userName} = socket;
          if (userName) {
            connectedUsers[userName] = false;
            socket.broadcast.emit('userDisconnected', userName);
            socket.disconnect();
          }
        }, heartBeat * 2);
      });
      socket.on('setUsername', (data) => {
        socket.userName = data;
        connectedUsers[data] = true;
        socket.broadcast.emit('userConnected', data);
      });
      socket.on('message', (data) => {
        const date = moment();
        const {message, author} = data;
        if (!message || !author) {
          console.error('wrong message', data);
          return;
        }
        const chatMessage = {author, message, date};
        chatHistory[name] = [...chatHistory[name], chatMessage];
        socket.emit('message', chatMessage);
        socket.broadcast.emit('message', chatMessage);
      });
      socket.on('disconnect', () => {
        const {userName} = socket;
        if (userName) {
          connectedUsers[userName] = false;
          socket.broadcast.emit('userDisconnected', userName);
        }
      });
      socket.on('createRoom', (data) => {
        manageSocket(data);
        socket.emit('roomCreated', data);
        socket.broadcast.emit('roomCreated', data);
      });
    });
};

manageSocket('chat');
manageSocket('room2');

httpServer.listen(3000, () => {
  console.log('Serwer HTTP działa na pocie 3000');
});
