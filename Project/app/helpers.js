import {closeOffer, getAllOffers} from './models/offer';
import moment from 'moment';

export const roundPrice = (price) => Math.round(price * 100) / 100;

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

export const PER_PAGE = 3;

export const auctionTypes = {
  buyNow: 'buy_now',
  auction: 'auction',
};

export const requestDurationMap = {
  1: MINUTE,
  2: HOUR,
  3: DAY,
  4: WEEK,
};

export const idComp = (id1, id2) => ('' + id1) === ('' + id2);

export const setOffersTimeout = () => {
  getAllOffers((error, offers) => {
    const now = moment();
    offers.forEach((offer) => {
      const created = moment(offer.createdAt);
      const closeTime = created.add(offer.duration, 'seconds');
      if (closeTime <= now) {
        return closeOffer(offer._id, () => console.log('closed', offer._id));
      }
      const difference = closeTime.diff(now);
      const duration = Math.round(moment.duration(difference).asMilliseconds());
      setTimeout(() => closeOffer(offer._id, () => console.log('closed', offer._id)), duration);
    });
  });
};
