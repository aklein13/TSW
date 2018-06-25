'use strict';

import {getAllOffers, getOffer} from '../models/offer';

export const index = (req, res) => {
  getAllOffers((err, docs) => {
    console.log('test', docs);
    res.render('home/index', {
      offers: docs,
    });
  });
};

export const offerDetail = (req, res) => {
  console.log('detail');
  console.log(req.params.uid);
  getOffer(req.params.uid, (err, docs) => {
    console.log(docs);
    res.render('home/detail', {
      offer: docs,
    });
  });
};
