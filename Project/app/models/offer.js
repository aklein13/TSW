'use strict';

import mongoose from 'mongoose';
import {HOUR, MINUTE, WEEK, auctionTypes, roundPrice} from '../helpers';

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

export const getAllOffers = (callback) => Offer.find({isFinished: false}, callback);

export const getOffer = (id, callback) => Offer.findById(id, callback);

export const bidOfferModel = (id, userId, price, callback) => {
  Offer.update(
    {_id: id},
    {$set: {price: price, buyerId: userId}},
    callback,
  );
};
