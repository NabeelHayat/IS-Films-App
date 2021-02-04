import mongoose from 'mongoose';
import Joi from 'joi';
import { v1 as uuidv1 } from 'uuid';

const { Schema } = mongoose;

// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);

const { Currency } = mongoose.Types;

const filmSchema = new Schema(
  {
    // eslint-disable-next-line no-unused-vars
    _id: { type: String, default: _ => uuidv1() },
    name: {
      type: String,
      unique: true,
      index: true,
      required: [true, "Name field can't be blank"],
    },
    description: {
      type: String,
      required: [true, "Description field can't be blank"],
    },
    releaseDate: {
      type: Date,
      required: [true, "Release date field can't be blank"],
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    ticketPrice: {
      type: Currency,
      require: [true, "Ticket Price field can't be blank"],
      min: -1,
      max: 500000, // this value is multiply with 100.
      default: '0',
    },
    country: {
      type: String,
      required: [true, "Country field can't be blank"],
    },
    genre: {
      type: [String],
      default: [],
      required: [true, "Film Genre can't be blank"],
    },
    photo: {
      type: String,
      required: [true, "Photo field can't be blank"],
    },
  }
);

filmSchema.statics = {
  /**
   * Create Film
   * @returns {Promise<Film, APIError>}
   */
  createFilm (filmData) {
    return this.create(filmData).then(film => {
      if (film) {
        return film;
      }
      return Promise.reject();
    });
  },
};

export const validateFilm = (film) => {
  const schema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    releaseDate: Joi.date().required(),
    rating: Joi.number().required(),
    ticketPrice: Joi.string().required(),
    country: Joi.string().required(),
    genre: Joi.array().items(Joi.string()),
    photo: Joi.string().required(),
  };
  return Joi.validate(film, schema);
};

const Film = mongoose.model('Film', filmSchema);

export default Film;
