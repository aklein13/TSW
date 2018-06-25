'use strict';

import {getOffer, bidOfferModel, buyOfferModel, createNewOffer} from '../models/offer';
import {auctionTypes, idComp, requestDurationMap} from '../helpers';

export const offerDetail = (req, res) => {
  getOffer(req.params.uid, (err, offer) => {
    const {user} = req;
    res.render('home/detail', {
      offer,
      user: user && !idComp(offer.ownerId, user._id) ? user : null,
    });
  });
};

export const bidOffer = (req, res) => {
  getOffer(req.params.uid, (err, offer) => {
    if (idComp(offer.ownerId, req.user._id)) {
      return res.status(400).send('You can\'t buy your own offer');
    }
    if (offer.type === auctionTypes.buyNow) {
      return buyOfferModel(req.params.uid, req.user._id, () => res.send('OK'));
    }
    const {price} = req.body;
    if (price - offer.price < 1) {
      return res.status(400).send('Price too low');
    }
    bidOfferModel(req.params.uid, req.user._id, price, () => res.send('OK'));
  });
};

export const newOffer = (req, res) => res.render('home/new', {});

export const postNewOffer = (req, res) => {
  const {body, user} = req;
  if (!body.title || !body.price) {
    return res.status(400).send('No title or price');
  }
  body.duration = requestDurationMap[body.duration];
  createNewOffer(body, user._id, (offer) => res.redirect(`/offers/${offer._id}`));
};
