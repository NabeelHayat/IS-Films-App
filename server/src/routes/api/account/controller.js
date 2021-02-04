/* eslint-disable no-unused-vars */
import UserModel from '../../../models/user';
import { registerSchema, loginSchema } from '../../../services/validators';

export default {
  loginResponse: (req, res) => {
    const { user } = req;
    req.login(user, { session: false }, err => {
      if (err) {
        return res.status(422).send({ message: err });
      }

      const token = req.user.generateJWT();
      const me = req.user.toJSON();
      res.json({ token, profile: me });
    });
  },

  userLogin: (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(422).send({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    req.body.email = email.toLowerCase();

    if (!email || !password) {
      return res.status(422).send({ error: 'You must provide a valid email or password.' });
    }

    UserModel.findOne({
      email,
    }, (err, existingUser) => {
      if (err || !existingUser) {
        return res.status(401).send({ error: 'User Not Found' });
      }
      if (existingUser) {
        next();
      }
    });
  },

  // Signup new user.
  userSignUp: async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
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
        UserModel.register(
          new UserModel({
            email: email.toLowerCase(),
            username,
            name,
          }),
          password,
          (err, account) => {
            console.log(account);
            if (err) {
              console.log(`ERROR${err}`);
              next(err);
            }
            req.user = account;
            res.json({ message: 'Register success.' }); // just redirect to login
          },
        );
      } catch (err) {
        return next(err);
      }
    } catch (err) {
      return next(err);
    }
  }
};
