'use strict';

import {index} from '../app/controllers/home';
import {handleRegister, login, register} from '../app/controllers/auth';
import {offerDetail} from '../app/controllers/offers';

export const router = (app, passport) => {
  app.get('/', index);
  app.get('/offers', index);
  app.get('/register', register);
  app.get('/login', login);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }), () => null);
  app.post('/register', handleRegister);

  app.get('/offers/:uid', offerDetail);

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
