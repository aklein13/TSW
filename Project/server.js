'use strict';


import fs from 'fs';
import {join} from 'path';
import express from 'express';
import passport from 'passport';
import mongoose from "mongoose";
import {router} from './config/routes';
import {expressApp} from './config/express';
import {getUserByEmail, User} from './app/models/user';
import {Offer} from './app/models/offer';
import {passportApp} from './config/passport';

// const socketio = require('socket.io');
const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;

export const app = express();
// const httpServer = require('http').createServer(app);

// export const io = socketio.listen(httpServer);
export const dbUrl = 'mongodb://localhost/test';

// Bootstrap models
fs.readdirSync(models).filter(file => ~file.indexOf('.js')).forEach(file => require(join(models, file)));

passportApp(passport);
expressApp(app, passport);
router(app, passport);

const listen = () => {
  let user;
  getUserByEmail('arek.klein@gmail.com', (err, res) => {
    return;
    user = res;
    if (user) {
      const tempOffer = new Offer({
        title: 'Frytki',
        ownerId: user._id,
        price: 2.137,
      });
      tempOffer.save();
      console.log(tempOffer);
    }
  });
  if (app.get('env') === 'test') {
    return;
  }
  app.listen(port);
  console.log('Express app started on port ' + port);
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
