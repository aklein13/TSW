/*jshint browser: true, globalstrict: true, devel: true, esversion: 6 */
/*global io: false */
'use strict';

// Inicjalizacja UI
document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    const chatList = document.getElementById('#chat');
    const renderMessage = (data) => {
      if (data && data.message) {
        const newMessage = document.createElement('ul');
        newMessage.textContent = `${data.author}: ${data.message}`;
        chatList.appendChild(newMessage);
      }
    };
    const chatStatus = document.getElementById('chatStatus');
    const userName = document.getElementById('username');
    const open = document.getElementById('open');
    const close = document.getElementById('close');
    const chatSend = document.getElementById('chatSend');
    const chatText = document.getElementById('chatText');
    const chatMessage = document.getElementById('chatMessage');
    const greenBullet = 'img/bullet_green.png';
    const redBullet = 'img/bullet_red.png';

    let chat;
    let chosedUserName = null;

    const getUsername = () => userName.value || 'Anonymous';

    close.disabled = true;
    chatSend.disabled = true;
    open.addEventListener('click', () => {
      open.disabled = true;
      userName.disabled = true;
      chosedUserName = getUsername();
      chat = io(`http://${location.host}/chat`);

      chat.on('connect', () => {
        close.disabled = false;
        chatSend.disabled = false;
        chatStatus.src = greenBullet;
        chat.emit('setUsername', chosedUserName);
        console.log('Nawiązano połączenie z kanałem „/chat”');
      });
      chat.on('chatStatus', (chatStatus) => {
        console.log(chatStatus);
        const {history, users} = chatStatus;
        history.forEach(renderMessage);
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
      chosedUserName = null;
    });
    // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
    chatSend.addEventListener('click', () => {
      console.log(userName.value);
      const messageToSend = {
        message: chatText.value,
        author: chosedUserName,
      };
      renderMessage(messageToSend);
      chat.emit('message', messageToSend);
      console.log(`Wysłałem wiadomość /chat: ${chatText.value}`);
      chatText.value = '';
    });
  }
};
