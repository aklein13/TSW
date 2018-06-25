'use strict';

import {getOffer, bidOfferModel} from '../models/offer';

export const offerDetail = (req, res) => {
  getOffer(req.params.uid, (err, docs) => {
    res.render('home/detail', {
      offer: docs,
      user: req.user,
    });
  });
};

export const bidOffer = (req, res) => {
  bidOfferModel(req.params.uid, req.user._id, req.body.amount, () => res.send('OK'));
};
