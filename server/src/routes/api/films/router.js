import { Router } from 'express';

import upload from '../../../middleware/multerUpload';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import FilmsController from './controller';

const router = Router();

router
  .route('/')
/** GET /api/v1/films - Get list of films */
  .get(requireJwtAuth, FilmsController.fetchFilms);

router
  .route('/create')
/** POST /api/v1/films/create - Create new film */
  .post([requireJwtAuth, upload.single('poster')], FilmsController.createFilm);

export default router;
