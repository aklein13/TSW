'use strict';

export const index = (req, res) => {
  res.render('home/index', {
    title: 'Node Express Mongoose Boilerplate'
  });
};
