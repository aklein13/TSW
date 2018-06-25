'use strict';

import {Chat, getChat, sendToChat, getMyChats} from '../models/chat';
import {getUserName} from '../models/user';
import {idComp} from "../helpers";

export const chatView = (req, res) => {
  const user1 = req.user._id;
  const user2 = req.params.uid;
  getChat(user1, user2, async (err, chat) => {
    let {user} = req;
    if (!chat) {
      const user1Name = user.email;
      const user2Name = await getUserName(user2);
      chat = new Chat({
        user1,
        user2,
        user1Name,
        user2Name,
      });
      chat.save();
    }
    console.log('chattorender', chat);
    user = {_id: '' + user._id, email: user.email};
    res.render('home/chat', {
      chat,
      user,
    });
  });
};

export const chatPost = (req, res) => {
  const user1 = req.user._id;
  const user2 = req.params.uid;
  const {message} = req.body;
  sendToChat(user1, user2, message, () => res.redirect('/messages/' + user2));
};

export const myChatsView = (req, res) => {
  const {user} = req;
  getMyChats(user._id, (err, chats) => {
    res.render('home/chats', {
      chats,
      user,
    });
  })
};
