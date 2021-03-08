import { Router } from 'express';

import multerUpload from '../../../middleware/multerUpload';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import FilmsController from './controller';
import { filmIdSchema } from '../../../services/validators';

const router = Router();

router
  .route('/')
/** GET /api/v1/films - Get list of films */
  .get(requireJwtAuth, FilmsController.fetchFilms);

router
  .route('/:filmId')
/** GET /api/v1/films - Get list of films */
  .get(requireJwtAuth, FilmsController.getFilm);

router
  .route('/create')
/** POST /api/v1/films/create - Create new film */
  .post([requireJwtAuth, multerUpload.single('poster')], FilmsController.uploadFilmPoster, FilmsController.createFilm);

router.param('filmId', async (req, res, next, filmId) => {
  const { error } = filmIdSchema.validate({ filmId });
  if (error) {
    return res.status(422).send({ message: error.details[0].message });
  }
  req.filmId = filmId;
  next();
});

export default router;
