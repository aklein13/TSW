'use strict';

import mongoose from 'mongoose';

const userPlugin = require('mongoose-user');
const Schema = mongoose.Schema;

/**
 * User schema
 */

const UserSchema = new Schema({
  name: {type: String, default: ''},
  email: {type: String, default: ''},
  hashed_password: {type: String, default: ''},
  salt: {type: String, default: ''}
});

/**
 * User plugin
 */

UserSchema.plugin(userPlugin, {});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UserSchema.method({});

/**
 * Statics
 */

UserSchema.static({});


export const User = mongoose.model('User', UserSchema);
