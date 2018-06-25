'use strict';

import {index} from '../app/controllers/home';

export const router = (app, passport) => {
  app.get('/', index);

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
