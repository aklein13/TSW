'use strict';

import {User} from '../models/user';

export const register = (req, res) => res.render('home/register');

export const login = (req, res) => res.render('home/login');

export const handleRegister = (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.render('home/register');
  }
  const newUser = new User({name: email, password, email});
  newUser.save();
  res.redirect('/login');
};
