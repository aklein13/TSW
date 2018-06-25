'use strict';

import mongoose from 'mongoose';
import moment from 'moment';
import {chatSocket} from '../../server';
import {Offer} from "./offer";

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
