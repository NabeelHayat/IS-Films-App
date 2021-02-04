import { Router } from 'express';

import AccountController from './controller';

const router = Router();

router.get('/profile', (req, res) => res.send(req.user));

router.route('/login').post(AccountController.userLogin);

export default router;
