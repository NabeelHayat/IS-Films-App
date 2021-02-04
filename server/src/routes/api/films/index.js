import { Router } from 'express';

const router = Router();



router.use('/account', accountRouter);

router.use('/films', filmsRouter);

export default router;
