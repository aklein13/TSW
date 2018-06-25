export const roundPrice = (price) => Math.round(price * 100) / 100;

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

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
