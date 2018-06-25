'use strict';

import {index} from '../app/controllers/home';
import {handleRegister, login, register} from '../app/controllers/auth';
import {offerDetail, bidOffer, newOffer, postNewOffer, myOffers} from '../app/controllers/offers';
import {chatView, chatPost, myChatsView} from "../app/controllers/chat";

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

export const router = (app, passport) => {
  app.get('/', index);
  app.get('/offers', index);
  app.get('/my', ensureAuthenticated, myOffers);
  app.get('/offers/new', ensureAuthenticated, newOffer);
  app.post('/offers/new', ensureAuthenticated, postNewOffer);
  app.get('/register', register);
  app.get('/messages', ensureAuthenticated, myChatsView);
  app.get('/messages/:uid', ensureAuthenticated, chatView);
  app.post('/messages/:uid', ensureAuthenticated, chatPost);
  app.get('/login', login);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }), () => null);
  app.post('/register', handleRegister);

  app.get('/offers/:uid', offerDetail);
  app.put('/offers/:uid', ensureAuthenticated, bidOffer);

  app.use((err, req, res, next) => {
    if (err.message
      && (~err.message.indexOf('not found')
        || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    res.status(500).render('500', {error: err.stack});
  });

  app.use((req, res, next) => {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });


};
