import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);

const { Currency } = mongoose.Types;

const filmSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
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
      max: 5000,
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

export const validateFilm = (film) => {
  const schema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    releaseDate: Joi.string().required(),
    rating: Joi.string().required(),
    ticketPrice: Joi.string().required(),
    country: Joi.string().required(),
    genre: Joi.array().items(Joi.string()),
    photo: Joi.string().required(),
  };
  return Joi.validate(film, schema);
};

const Film = mongoose.model('Film', filmSchema);

export default Film;
