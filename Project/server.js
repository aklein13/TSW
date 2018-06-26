'use strict';

import fs from 'fs';
import {join} from 'path';
import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import {router} from './config/routes';
import {expressApp} from './config/express';
import {getUserByEmail, User} from './app/models/user';
import {passportApp} from './config/passport';
import {setOffersTimeout} from './app/helpers';
import path from 'path';

const models = join(__dirname, 'app/models');

export const app = express();

export const dbUrl = 'mongodb://localhost/test';

// Bootstrap models
fs.readdirSync(models).filter(file => ~file.indexOf('.js')).forEach(file => require(join(models, file)));

passportApp(passport);
expressApp(app, passport);
router(app, passport);

const httpServer = require('http').createServer(app);

const listen = () => {
  let user;
  getUserByEmail('arek.klein@gmail.com', (err, res) => {
    setOffersTimeout();
    return;
    user = res;
    if (user) {
      const tempOffer = {
        title: 'Frytki',
        ownerId: user._id,
        price: 2.137,
      };
      createOffer(tempOffer);
    }
  });
  httpServer.listen(3000, () => console.log('Server listening on port 3000'));
};

const connect = () => {
  mongoose.connect('mongodb://localhost/test');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', listen);
  db.on('disconnected', connect);
  return db;
};

export const connection = connect();

const socketio = require('socket.io');

app.use(express.static(path.join(__dirname, 'public')));

const io = socketio.listen(httpServer);
export const updatesSocket = io.of('/updates');
export const chatSocket = io.of('/chat');
chatSocket.on('connection', (socket) => {
  socket.on('user_info', (userId) => socket.join(userId));
});

