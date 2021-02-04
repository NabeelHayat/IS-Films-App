/* eslint-disable max-len */
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { v1 as uuidv1 } from 'uuid';

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

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

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

userSchema.methods.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errh, hash) => {
      if (err) {
        console.log(err);
      }
      // set pasword to hash
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

export async function hashPassword (password) {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  return hashedPassword;
}

export const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
    username: Joi.string()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/)
      .required(),
    email: Joi.string().email(),
    password: Joi.string()
      .min(6)
      .max(20)
      .allow('')
      .allow(null),
  };

  return Joi.validate(user, schema);
};

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

export default User;
