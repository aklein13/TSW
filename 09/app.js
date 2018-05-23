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

const manageSocket = (socket, name) => {
};

const getChatState = () => {
  return {
    history: chatHistory.chat,
    users: Object.keys(connectedUsers).filter((userName) => connectedUsers[userName]),
    heartbeat: heartBeat,
  }
};

const chatChannel = io
  .of('/chat')
  .on('connect', (socket) => {
    socket.emit('chatStatus', getChatState());
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
      chatHistory.chat = [...chatHistory.chat, chatMessage];
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
  });

// const news = io
//   .of('/news')
//   .on('connect', (socket) => {
//     console.log('Uruchomiłem kanał „/news”');
//     socket.on('message', (data) => {
//       console.log(`/news: ${data}`);
//       socket.emit('message', `/news: ${data}`);
//     });
//   });

httpServer.listen(3000, () => {
  console.log('Serwer HTTP działa na pocie 3000');
});
