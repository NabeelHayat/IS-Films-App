import { Router } from 'express';

import accountRouter from './account/router';
import filmsRouter from './films/router';

const router = Router();

router.use('/account', accountRouter);

router.use('/films', filmsRouter);

export default router;

/*
routes:

POST /api/v1/account/login
POST /api/v1/account/register
GET /api/v1/account/logout

GET /api/v1/films
GET /api/v1/films/:slug
POST /api/v1/films/create
POST /api/v1/films/comment

*/
