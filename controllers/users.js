const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const RegAuthError = require('../errors/RegAuthError');
const MongoError = require('../errors/MongoError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new RegAuthError('Введены неверное имя или пароль'));
    });
};
module.exports.findUserMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
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
      res.status(200).send({ message: 'Успешная регистрация' });
    })
    .catch(() => {
      next(new MongoError('Пользователь с таким email уже существует'));
    });
};
