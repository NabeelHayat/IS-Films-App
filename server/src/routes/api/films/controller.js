/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
import UserModel from '../../../models/user';
import FilmModel from '../../../models/film';
import { filmSchema } from '../../../services/validators';

const { format } = require('util');
const firebase = require('../../../services/firebase');

const { bucket } = firebase;

function uploadImageToStorage (req, res) {
  return new Promise(async (resolve, reject) => {
    if (!req.file) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('No image file');
    }

    const blob = bucket.file(req.file.originalname);

    const blobWriter = blob.createWriteStream({
      public: true,
      metadata: {
        contentType: req.file.mimetype,
        cacheControl: 'public, max-age=31536000',
      }
    });

    blobWriter.on('error', (err) => {
      console.log(err);
    });

    const options = {
      version: 'v2', // defaults to 'v2' if missing.
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // one hour
    };

    blobWriter.on('finish', async () => {
      // Get a v2 signed URL for the file
      const url = await bucket(bucket.name)
        .file(req.file.originalname)
        .getSignedUrl(options);
        
      res.status(200).json({ message: 'File uploaded.', url });
    });

    blobWriter.end(req.file.buffer);
  });
}

export default {

  // Upload film posters into the firebase cloud server.
  uploadFilmPoster: async (req, res, next) => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    const { file } = req;

    if (file) {
      uploadImageToStorage(req, res, file).then((success) => {
        next();
      }).catch((error) => {
        next(error);
      });
    }
  },

  // Get specific film with there film id.
  getFilm: async (req, res) => {
    const { filmId } = req;
    if (!filmId) return res.status(404).json({ message: 'No film found.' });
    try {
      const film = await FilmModel.findOne({ _id: filmId });
      if (!film) return res.status(404).json({ message: 'No film foun d.' });
      res.json({ film: [film] });
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  },

  // Fetch all list of films.
  fetchFilms: async (req, res) => {
    try {
      const films = await FilmModel.find({});
      if (!films) return res.status(404).json({ message: 'No film found.' });
      res.json({ films });
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  },

  // Create new film into the database.
  createFilm: async (req, res) => {

    const { publicUrl } = req;

    const tempUser = await UserModel.findOne({ _id: req.query.userId }, '-_id -__v -createdAt');
    if (!tempUser) {
      return res.status(404).json({ message: 'No such user.' });
    }
    if (!(tempUser.id === req.user.id)) {
      return res.status(400).json({ message: 'You do not have privilegies to edit this user.' });
    }

    const { error } = filmSchema.validate(req.body);
    if (error) {
      return res.status(422).send({ message: error.details[0].message });
    }

    const { name, description, releaseDate, rating, ticketPrice, country, genre } = req.body;

    FilmModel.findOne({ name, releaseDate }).then(film => {
      if (film) {
        return res.status(200).json({ film: film.toJSON() });
      }

      FilmModel.createFilm({
        name,
        description,
        releaseDate,
        rating,
        ticketPrice,
        country,
        genre,
        photo: publicUrl
      }).then(film => {
        res.status(200).json({ film: film.toJSON() });
      }).catch(err => {
        res.status(500).json({ message: 'Something went wrong.', err });
      });
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong.', err });
    });
  }
};
