'use strict';

import {defaultImg, getAllOffersPaginated, getOffersCount} from '../models/offer';
import {PER_PAGE} from '../helpers';

export const index = (req, res) => {
  const page = parseInt(req.query.page);
  getAllOffersPaginated(page || 0, (err, docs) => {
    getOffersCount((err, count) => {
      const pagination = {
        count,
        pages: Math.ceil(count / PER_PAGE),
        page: page || 0,
      };
      res.render('home/index', {
        offers: docs,
        user: req.user,
        defaultImg: defaultImg,
        pagination,
      });
    })
  });
};
