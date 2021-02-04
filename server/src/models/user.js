/* eslint-disable max-len */
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import jwt from 'jsonwebtoken';
import { v1 as uuidv1 } from 'uuid';

import config from '../config';

const { secretOrKey } = config;

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // eslint-disable-next-line no-unused-vars
    _id: { type: String, default: _ => uuidv1() },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Username can't be blank"],
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email can't be blank"],
      // Regexp to validate emails with more strict rules as added in tests/users.js
      // which also conforms mostly with RFC2822 guide lines
      unique: true,
      match: [
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email',
      ],
      index: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 60,
    },
    name: String,
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function() {
  return {
    id: this._id,
    email: this.email,
    username: this.username,
    name: this.name,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.methods.generateJWT = function() {
  const token = jwt.sign(
    {
      expiresIn: '12h',
      userId: this._id,
      username: this.username,
      email: this.email,
    },
    secretOrKey
  );
  return token;
};

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

export default User;
