// const moment = require('moment');

// Inicjalizacja UI
document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    const previousUsername = localStorage.getItem('userName');
    const userName = document.getElementById('username');
    if (previousUsername) {
      userName.value = previousUsername;
    }
    const chatList = document.getElementById('chat');
    const userList = document.getElementById('users');
    const roomList = document.getElementById('rooms');
    const renderMessage = (data) => {
      if (data && data.message) {
        let msgDate = new Date(data.date) || '';
        if (data.date) {
          msgDate.setMinutes(msgDate.getMinutes() - msgDate.getTimezoneOffset());
          msgDate = `${msgDate.getUTCHours()}:${msgDate.getMinutes()}`;
        }
        const newMessage = document.createElement('ul');
        newMessage.textContent = `${msgDate} - ${data.author}: ${data.message}`;
        chatList.appendChild(newMessage);
      }
    };
    const renderUser = (username) => {
      const newUser = document.createElement('ul');
      newUser.className = 'user';
      newUser.textContent = username;
      userList.appendChild(newUser);
    };
    const removeUser = (username) => {
      userList.childNodes.forEach((user) => user.textContent === username && user.remove());
    };
    const clearChat = () => {
      while (chatList.firstChild) {
        chatList.removeChild(chatList.firstChild);
      }
      while (roomList.firstChild) {
        roomList.removeChild(roomList.firstChild);
      }
      while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
      }
    };
    let roomName = 'chat';
    const joinRoom = (room) => {
      console.log('joined room: ', room);
      roomName = room;
      connectToChat(room);
    };
    const renderRoom = (room) => {
      const newRoom = document.createElement('ul');
      newRoom.className = 'room';
      newRoom.textContent = room;
      newRoom.onclick = () => joinRoom(room);
      roomList.appendChild(newRoom);
    };
    const removeAllUsers = () => userList.childNodes.forEach((user) => user.remove());
    const roomNameH3 = document.getElementById('room-name');
    const chatStatus = document.getElementById('chatStatus');
    const open = document.getElementById('open');
    const close = document.getElementById('close');
    const createRoomButton = document.getElementById('createRoom');
    const newRoomName = document.getElementById('newRoomName');
    const chatSend = document.getElementById('chatSend');
    const chatText = document.getElementById('chatText');
    const greenBullet = 'img/bullet_green.png';
    const redBullet = 'img/bullet_red.png';
    let chat;
    createRoomButton.addEventListener('click', () => {
      if (!chat || !newRoomName.value) {
        return alert('Connect to chat first and name new room');
      }
      chat.emit('createRoom', newRoomName.value);
    });

    let chosenUserName = null;

    const getUsername = () => userName.value || 'Anonymous';

    close.disabled = true;
    chatSend.disabled = true;
    var connectToChat = (name) => {
      if (chat) {
        chat.disconnect();
        chat = null;
      }
      open.disabled = true;
      userName.disabled = true;
      chosenUserName = getUsername();
      localStorage.setItem('userName', chosenUserName);
      chat = io(`http://${location.host}/${name}`);

      chat.on('connect', () => {
        clearChat();
        roomNameH3.textContent = name;
        close.disabled = false;
        chatSend.disabled = false;
        chatStatus.src = greenBullet;
        chat.emit('setUsername', chosenUserName);
        console.log('Nawiązano połączenie z kanałem ' + name);
      });
      chat.on('chatStatus', (chatStatus) => {
        console.log(chatStatus);
        const {history, users, heartbeat, rooms} = chatStatus;
        chat.heartbeat = setInterval(() => chat.emit('heartbeat'), heartbeat);
        history.forEach(renderMessage);
        renderUser(chosenUserName);
        users.forEach((user) => user !== chosenUserName && renderUser(user));
        rooms.forEach(renderRoom);
      });
      chat.on('userConnected', (userName) => renderUser(userName));
      chat.on('userDisconnected', (userName) => removeUser(userName));
      chat.on('disconnect', () => {
        open.disabled = false;
        chatStatus.src = redBullet;
      });
      chat.on('message', renderMessage);
      chat.on('roomCreated', (roomName) => renderRoom(roomName));
    };

    open.addEventListener('click', () => connectToChat(roomName));

    // Zamknij połączenie po kliknięciu guzika „Rozłącz”
    close.addEventListener('click', () => {
      close.disabled = true;
      chatSend.disabled = true;
      userName.disabled = false;
      clearInterval(chat.heartbeat);
      chat.disconnect();
      chosenUserName = null;
      removeAllUsers();
    });
    // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
    chatSend.addEventListener('click', () => {
      console.log(userName.value);
      const messageToSend = {
        message: chatText.value,
        author: chosenUserName,
      };
      chat.emit('message', messageToSend);
      console.log(`Wysłałem wiadomość /chat: ${chatText.value}`);
      chatText.value = '';
    });
  }
};
