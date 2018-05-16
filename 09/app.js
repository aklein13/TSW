//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

// io.set('heartbeat timeout', 10);
// io.set('heartbeat interval', 10);
const chatHistory = {
  chat: [],
};

const connectedUsers = [];

const manageSocket = (socket, name) => {
};

const getChatState = () => {
  return{
    history: chatHistory.chat,
    users: connectedUsers,
  }
};

const chatChannel = io
  .of('/chat')
  .on('connect', (socket) => {
    socket.emit('chatStatus', getChatState());
    socket.on('setUsername', (data) => connectedUsers.push(data));
    socket.on('message', (data) => {
      const {message, author} = data;
      if (!message || !author) {
        console.error('wrong message', data);
        return;
      }
      const chatMessage = {author, message};
      chatHistory.chat = [...chatHistory.chat, chatMessage];
      socket.broadcast.emit('message', chatMessage);
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
