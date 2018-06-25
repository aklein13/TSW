'use strict';

import mongoose from 'mongoose';
import {HOUR, MINUTE, WEEK, auctionTypes, roundPrice} from '../helpers';
import moment from 'moment';

const Schema = mongoose.Schema;
const {ObjectId} = Schema.Types;

/**
 * Offer schema
 */

const OfferSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, default: ''},
  price: {
    type: Number,
    get: roundPrice,
    set: roundPrice,
    min: 0,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(auctionTypes),
    default: auctionTypes.auction,
  },
  ownerId: {type: ObjectId, required: true},
  buyerId: {type: ObjectId},
  isFinished: {type: Boolean, default: false},
  // Duration in seconds
  duration: {type: Number, min: MINUTE, max: WEEK, default: HOUR},
}, {timestamps: true});

export const Offer = mongoose.model('Offer', OfferSchema);

export const createOffer = async (data) => {
  const newOffer = new Offer({...data});
  await newOffer.save();
  const created = moment(newOffer.createdAt);
  const closeTime = created.add(newOffer.duration, 'seconds');
  const now = moment();
  if (closeTime <= now) {
    closeOffer(newOffer._id, () => console.log('closed', newOffer._id));
    return newOffer;
  }
  const difference = closeTime.diff(now);
  const duration = Math.round(moment.duration(difference).asMilliseconds());
  setTimeout(() => closeOffer(newOffer._id, () => console.log('closed', newOffer._id)), duration);
  return newOffer;
};

export const getAllOffers = (callback) => Offer.find({isFinished: false}, callback);

export const getMyOffers = (userId, callback) => {
  Offer.find({$or: [{ownerId: userId}, {buyerId: userId}]}, callback);
};

export const getOffer = (id, callback) => Offer.findById(id, callback);

export const bidOfferModel = (id, userId, price, callback) => {
  Offer.update(
    {_id: id},
    {$set: {price: price, buyerId: userId}},
    callback,
  );
};

export const buyOfferModel = (id, userId, callback) => {
  Offer.update(
    {_id: id},
    {$set: {buyerId: userId, isFinished: true}},
    callback,
  );
};

export const createNewOffer = async (body, userId, callback) => {
  const newOffer = await createOffer({...body, ownerId: userId});
  callback(newOffer);
};

export const closeOffer = (id, callback) => {
  Offer.update(
    {_id: id},
    {$set: {isFinished: true}},
    callback,
  );
};
