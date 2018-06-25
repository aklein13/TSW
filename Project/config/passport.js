'use strict';

import mongoose from 'mongoose';
import {passportLocal} from './passport/local';

const User = mongoose.model('User');

export const passportApp = (passport) => {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findOne({_id: id}, done));
  passport.use(passportLocal);
};
