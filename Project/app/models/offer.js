'use strict';

import mongoose from 'mongoose';
import {HOUR, MINUTE, WEEK, auctionTypes, roundPrice, PER_PAGE} from '../helpers';
import moment from 'moment';
import {updatesSocket} from '../../server';

export const defaultImg = 'https://www.flooringvillage.co.uk/ekmps/shops/flooringvillage/images/request-a-sample--547-p.jpg';
const Schema = mongoose.Schema;
const {ObjectId} = Schema.Types;

const activeFilter = {isFinished: false};

/**
 * Offer schema
 */

const OfferSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, default: ''},
  imageUrl: {type: String, default: defaultImg},
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

export const getOffersCount = (callback) => {
  const query2 = Offer.find(activeFilter).count();
  query2.exec(callback);
};

export const getAllOffersPaginated = (page, callback) => {
  const query = Offer.find(activeFilter).limit(PER_PAGE).skip(page * PER_PAGE);
  query.exec(callback);
};

export const getAllOffers = (callback) => Offer.find(activeFilter, callback);

export const getMyOffers = (userId, callback) => {
  const query = Offer.find({$or: [{ownerId: userId}, {buyerId: userId}]}).sort('-updatedAt');
  query.exec(callback);
};

export const getOffer = (id, callback) => Offer.findById(id, callback);

export const bidOfferModel = (id, userId, price, callback) => {
  Offer.update(
    {_id: id},
    {$set: {price, buyerId: userId}},
    callback,
  );
  updatesSocket.emit('update', {uid: id, price});
};

export const buyOfferModel = (id, userId, callback) => {
  Offer.update(
    {_id: id},
    {$set: {buyerId: userId, isFinished: true}},
    callback,
  );
  updatesSocket.emit('close', id);
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
  updatesSocket.emit('close', id);
};
