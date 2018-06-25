'use strict';


import {User} from "../models/user";

export const register = (req, res) => res.render('home/register');

export const handleRegister = (req, res) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    res.render('home/register');
  }
  const newUser = new User({name: username, password, email});
  newUser.save();
  res.redirect('/login');
};
