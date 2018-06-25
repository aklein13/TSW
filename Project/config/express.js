'use strict';

import express from 'express';

const session = require('express-session');
import compression from 'compression';
import morgan from 'morgan';

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const helpers = require('view-helpers');
const pkg = require('../package.json');
import path from 'path';
import {dbUrl} from '../server';

const env = process.env.NODE_ENV || 'development';
export const root = path.normalize(__dirname + '/..');
export const expressApp = (app, passport) => {

  app.use(compression({threshold: 512}));

  app.use(express.static(root + '/public'));

  if (env !== 'test') {
    app.use(morgan('dev'));
  }

  app.set('views', root + '/app/views');
  app.set('view engine', 'pug');

  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  app.use(cookieParser());
  app.use(cookieSession({secret: 'secret'}));
  app.use(session({
    secret: pkg.name,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      url: dbUrl,
      collection: 'sessions'
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  app.use(helpers(pkg.name));

  // adds CSRF support
  if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      next();
    });
  }
};
