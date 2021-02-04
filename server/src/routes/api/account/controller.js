import UserModel from '../../../models/user';
import token from '../../../utils/token';

export default {
  userLogin: (req, res) => {
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
  }
};
