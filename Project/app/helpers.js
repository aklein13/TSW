export const roundPrice = (price) => Math.round(price * 100) / 100;

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

export const auctionTypes = {
  buyNow: 'buy_now',
  auction: 'action',
};
