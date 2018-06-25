'use strict';

import {getOffer, bidOfferModel, buyOfferModel} from '../models/offer';
import {auctionTypes} from '../helpers';

export const offerDetail = (req, res) => {
  getOffer(req.params.uid, (err, docs) => {
    res.render('home/detail', {
      offer: docs,
      user: req.user,
    });
  });
};

export const bidOffer = (req, res) => {
  getOffer(req.params.uid, (err, offer) => {
    if (offer.ownerId === req.user._id) {
      return res.status(400).send('You can\'t buy your own offer');
    }
    if (offer.type === auctionTypes.buyNow) {
      return buyOfferModel(req.params.uid, req.user._id, () => res.send('OK'));
    }
    const {price} = req.body;
    if (price - offer.price < 1) {
      return res.status(400).send('Price too low');
    }
    if (offer.ownerId === req.user._id) {
      return res.status(400).send('You can\'t buy your own offer');
    }
    bidOfferModel(req.params.uid, req.user._id, price, () => res.send('OK'));
  });
};
