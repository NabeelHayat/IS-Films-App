import { Router } from 'express';

import AccountController from './controller';
import requireLocalAuth from '../../../middleware/requireLocalAuth';

const router = Router();

// router.get('/profile', (req, res) => res.send(req.user));

router.route('/login').post(AccountController.userLogin, requireLocalAuth, AccountController.loginResponse);

router.route('/register').post(AccountController.userSignUp);

export default router;
