'use strict';

import mongoose from 'mongoose';
import moment from 'moment';
import {chatSocket} from '../../server';
import {Offer} from "./offer";
import {idComp} from "../helpers";

const Schema = mongoose.Schema;
const {Mixed, ObjectId} = Schema.Types;

/**
 * Chat schema
 */

const ChatSchema = new Schema({
  messages: {type: Mixed},
  user1: {type: ObjectId, required: true},
  user1Name: {type: String, required: true},
  user2: {type: ObjectId, required: true},
  user2Name: {type: String, required: true},
}, {timestamps: true});

export const Chat = mongoose.model('Chat', ChatSchema);

export const getChat = (user1Id, user2Id, callback) => {
  Chat.findOne(
    {
      $or: [
        {$and: [{user1: user1Id}, {user2: user2Id}]},
        {$and: [{user1: user2Id}, {user2: user1Id}]},
      ],
    }, callback);
};

export const getMyChats = (userId, callback) => {
  Chat.find(
    {
      $or: [
        {user1: userId},
        {user2: userId},
      ],
    }, callback);
};

export const sendToChat = (user1Id, user2Id, message, callback) => {
  getChat(user1Id, user2Id, (err, chat) => {
    if (chat) {
      const now = moment();
      const nowStr = moment().format();
      const writer = idComp(chat.user1, user1Id) ? chat.user1Name : chat.user2Name;
      const newMessage = {
        date: nowStr,
        time: now.format('HH:mm'),
        from: user1Id,
        fromName: writer,
        message,
      };
      chat.messages = chat.messages ? {...chat.messages, [nowStr]: newMessage} : {[nowStr]: newMessage};
      chat.markModified('messages');
      chat.save();
      console.log('saved', chat);
      newMessage.chat_id = chat._id;
      chatSocket.to(user1Id).emit('message', newMessage);
      chatSocket.to(user2Id).emit('message', newMessage);
      return callback(chat);
    }
    console.error('Chat not found', user1Id, user2Id);
    return callback(null);
  })
};
