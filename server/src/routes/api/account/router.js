import { Router } from 'express';

import AccountController from './controller';
import requireLocalAuth from '../../../middleware/requireLocalAuth';

const router = Router();

router
  .route('/login')
  /** POST /api/v1/account/login - User login */
  .post(AccountController.userLogin, requireLocalAuth, AccountController.loginResponse);

router
  .route('/register')
  /** POST /api/v1/account/register - New user signup */
  .post(AccountController.userSignUp);

export default router;
