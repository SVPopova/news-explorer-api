const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const RegAuthError = require('../errors/RegAuthError');
const MongoError = require('../errors/MongoError');
const { badRequestMessage, notFoundMessageUser, successMessage, mongoErrorMessage } = require('../errors/errorsMessage');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new RegAuthError(badRequestMessage));
    });
};
module.exports.findUserMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundMessageUser);
      }
      return res.send(user);
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(200).send({ message: successMessage });
    })
    .catch(() => {
      next(new MongoError(mongoErrorMessage));
    });
};
