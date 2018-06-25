'use strict';

import {getAllOffers} from '../models/offer';

export const index = (req, res) => {
  getAllOffers((err, docs) => {
    res.render('home/index', {
      offers: docs,
      user: req.user,
    });
  });
};
