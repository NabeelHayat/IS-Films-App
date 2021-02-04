import UserModel from '../../../models/user';
import FilmModel from '../../../models/film';
import { filmSchema } from '../../../services/validators';
import { removeFailedFile } from '../../../middleware/multerUpload';

export default {
  fetchFilms: async (req, res) => {
    try {
      const films = await FilmModel.find({});
      if (!films) return res.status(404).json({ message: 'No film found.' });
      res.json({ films });
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  },

  createFilm: async (req, res) => {
    let avatarPath = null;
    if (req.file) {
      avatarPath = req.file.filename;
    }

    const tempUser = await UserModel.findOne({ _id: req.query.userId }, '-_id -__v -createdAt');
    if (!tempUser) {
      removeFailedFile(avatarPath);
      return res.status(404).json({ message: 'No such user.' });
    }
    if (!(tempUser.id === req.user.id)) {
      removeFailedFile(avatarPath);
      return res.status(400).json({ message: 'You do not have privilegies to edit this user.' });
    }

    const { error } = filmSchema.validate(req.body);
    if (error) {
      removeFailedFile(avatarPath);
      return res.status(422).send({ message: error.details[0].message });
    }

    const { name, description, releaseDate, rating, ticketPrice, country, genre } = req.body;

    FilmModel.findOne({ name, releaseDate }).then(film => {
      if (film) {
        removeFailedFile(avatarPath);
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
        photo: avatarPath
      }).then(film => {
        res.status(200).json({ film: film.toJSON() });
      }).catch(err => {
        removeFailedFile(avatarPath);
        res.status(500).json({ message: 'Something went wrong.', err });
      });
    }).catch(err => {
      removeFailedFile(avatarPath);
      res.status(500).json({ message: 'Something went wrong.', err });
    });
  }
};
