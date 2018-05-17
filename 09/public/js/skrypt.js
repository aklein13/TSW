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
    const renderMessage = (data) => {
      if (data && data.message) {
        let msgDate = data.date || '';
        if (data.date) {
          // msgDate = moment(data.date).format('HH:mm');
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
    const removeAllUsers = () => userList.childNodes.forEach((user) => user.remove());
    const chatStatus = document.getElementById('chatStatus');
    const open = document.getElementById('open');
    const close = document.getElementById('close');
    const chatSend = document.getElementById('chatSend');
    const chatText = document.getElementById('chatText');
    const chatMessage = document.getElementById('chatMessage');
    const greenBullet = 'img/bullet_green.png';
    const redBullet = 'img/bullet_red.png';

    let chat;
    let chosenUserName = null;

    const getUsername = () => userName.value || 'Anonymous';

    close.disabled = true;
    chatSend.disabled = true;
    open.addEventListener('click', () => {
      open.disabled = true;
      userName.disabled = true;
      chosenUserName = getUsername();
      localStorage.setItem('userName', chosenUserName);
      chat = io(`http://${location.host}/chat`);

      chat.on('connect', () => {
        close.disabled = false;
        chatSend.disabled = false;
        chatStatus.src = greenBullet;
        chat.emit('setUsername', chosenUserName);
        console.log('Nawiązano połączenie z kanałem „/chat”');
      });
      chat.on('chatStatus', (chatStatus) => {
        console.log(chatStatus);
        const {history, users} = chatStatus;
        history.forEach(renderMessage);
        renderUser(chosenUserName);
        users.forEach((user) => user !== chosenUserName && renderUser(user));
      });
      chat.on('userConnected', (userName) => renderUser(userName));
      chat.on('userDisconnected', (userName) => {
        removeUser(userName);
      });
      chat.on('disconnect', () => {
        open.disabled = false;
        chatStatus.src = redBullet;
        console.log('Połączenie z kanałem „/chat” zostało zakończone');
      });
      chat.on('message', renderMessage);
    });

    // Zamknij połączenie po kliknięciu guzika „Rozłącz”
    close.addEventListener('click', () => {
      close.disabled = true;
      chatSend.disabled = true;
      userName.disabled = false;
      chatMessage.textContent = '';
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
      renderMessage(messageToSend);
      chat.emit('message', messageToSend);
      console.log(`Wysłałem wiadomość /chat: ${chatText.value}`);
      chatText.value = '';
    });
  }
};
