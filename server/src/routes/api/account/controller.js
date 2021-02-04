import Joi from 'joi';

import UserModel from '../../../models/user';
import token from '../../../utils/token';
import { registerSchema, loginSchema } from '../../../services/validators';

export default {
  userLogin: (req, res) => {
    const { error } = Joi.validate(req.body, loginSchema);
    if (error) {
      return res.status(422).send({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).send({ error: 'You must provide a valid email or password.' });
    }

    UserModel.findOne({
      email,
    }, (err, existingUser) => {
      if (err || !existingUser) {
        return res.status(401).send(err || { error: 'User Not Found' });
      }
      if (existingUser) {
        existingUser.comparedPassword(password, (err, good) => {
          if (err || !good) {
            return res.status(401).send(err || 'User not found');
          }

          res.send({
            token: token.generateToken(existingUser)
          });
        });
      }
    });
  },

  // Signup new user.
  userSignUp: async (req, res, next) => {
    const { error } = Joi.validate(req.body, registerSchema);
    if (error) {
      return res.status(422).send({ message: error.details[0].message });
    }

    const { email, password, name, username } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(422).send({ message: 'Email is in use' });
      }

      try {
        const newUser = await new UserModel({
          email,
          password,
          username,
          name,
        });

        newUser.registerUser(newUser, (err, _user) => {
          if (err) throw err;
          res.json({ message: 'Register success.' }); // just redirect to login
        });
      } catch (err) {
        return next(err);
      }
    } catch (err) {
      return next(err);
    }
  }
};
