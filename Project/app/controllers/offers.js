'use strict';

import {getOffer, bidOfferModel, buyOfferModel, createNewOffer, getMyOffers} from '../models/offer';
import {auctionTypes, idComp, requestDurationMap} from '../helpers';

export const myOffers = (req, res) => {
  getMyOffers(req.user._id, (err, offers) => {
    const {user} = req;
    offers = offers.map((offer) => {
      console.log(offer.ownerId);
      console.log(user._id);
      return {
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        own: idComp(user._id, offer.ownerId),
        createdAt: offer.createdAt,
        isFinished: offer.isFinished,
      };
    });
    res.render('home/my', {
      offers,
      user,
    });
  });
};

export const offerDetail = (req, res) => {
  getOffer(req.params.uid, (err, offer) => {
    if (!offer) {
      return res.redirect('/');
    }
    let {user} = req;
    if (user) {
      user = {_id: user._id, email: user.email, own: idComp(offer.ownerId, user._id)};
    }
    console.log(user);
    res.render('home/detail', {
      offer,
      user,
    });
  });
};

export const bidOffer = (req, res) => {
  getOffer(req.params.uid, (err, offer) => {
    if (offer.isFinished) {
      return res.status(400).send('Offer is already end');
    }
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

export const newOffer = (req, res) => res.render('home/new', {user: req.user});

export const postNewOffer = (req, res) => {
  const {body, user} = req;
  if (!body.title || !body.price) {
    return res.status(400).send('No title or price');
  }
  body.duration = requestDurationMap[body.duration];
  createNewOffer(body, user._id, (offer) => {
    console.log('dostalem', offer);
    res.redirect(`/offers/${offer._id}`)
  });
};
