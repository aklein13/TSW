'use strict';

import {
  getOffer,
  bidOfferModel,
  buyOfferModel,
  createNewOffer,
  getMyOffers,
  defaultImg,
} from '../models/offer';
import {auctionTypes, idComp, requestDurationMap} from '../helpers';
import moment from 'moment';

export const myOffers = (req, res) => {
  getMyOffers(req.user._id, (err, offers) => {
    const {user} = req;
    offers = offers.map((offer) => {
      return {
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        own: idComp(user._id, offer.ownerId),
        createdAt: offer.createdAt,
        isFinished: offer.isFinished,
        ownerId: offer.ownerId,
        imgUrl: offer.imgUrl || defaultImg,
        type: offer.type,
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
    const created = moment(offer.createdAt);
    const closeTime = created.add(offer.duration, 'seconds');
    const now = moment();
    const difference = closeTime.diff(now);
    let duration = Math.round(moment.duration(difference).asSeconds());
    if (duration < 0) {
      duration = 0;
    }
    offer = {
      _id: offer._id,
      title: offer.title,
      description: offer.description,
      price: offer.price,
      own: user ? idComp(user._id, offer.ownerId) : false,
      createdAt: offer.createdAt,
      isFinished: offer.isFinished,
      ownerId: offer.ownerId,
      type: offer.type,
      imageUrl: offer.imageUrl || defaultImg,
      closeTime: duration,
    };
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
  body.imageUrl = body.imgUrl;
  createNewOffer(body, user._id, (offer) => {
    res.redirect(`/offers/${offer._id}`)
  });
};
