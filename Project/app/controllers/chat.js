'use strict';

import {Chat, getChat, sendToChat} from '../models/chat';
import {getUserName} from '../models/user';

export const chatView = (req, res) => {
  const user1 = req.user._id;
  const user2 = req.params.uid;
  getChat(user1, user2, async (err, chat) => {
    if (!chat) {
      const user1Name = req.user.email;
      const user2Name = await getUserName(user2);
      console.log(user2);
      console.log('init');
      console.log(user1Name);
      console.log('jajebie', user2Name);
      chat = new Chat({
        user1,
        user2,
        user1Name,
        user2Name,
      });
      chat.save();
    }
    console.log('chattorender', chat);
    res.render('home/chat', {
      chat,
    });
  });
};

export const chatPost = (req, res) => {
  const user1 = req.user._id;
  const user2 = req.params.uid;
  const {message} = req.body;
  sendToChat(user1, user2, message, () => res.redirect('/messages/' + user2));
};
