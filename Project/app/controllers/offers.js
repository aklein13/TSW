'use strict';

import {getOffer} from '../models/offer';

export const offerDetail = (req, res) => {
  getOffer(req.params.uid, (err, docs) => {
    res.render('home/detail', {
      offer: docs,
    });
  });
};
