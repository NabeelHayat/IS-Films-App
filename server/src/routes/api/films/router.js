import { Router } from 'express';

import FilmsController from './controller';

const router = Router();

router.route('/create').post(FilmsController.createFilm);

export default router;
