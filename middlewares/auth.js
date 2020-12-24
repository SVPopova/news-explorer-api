const jwt = require('jsonwebtoken');
const RegAuthError = require('../errors/RegAuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new RegAuthError('Ошибка авторизации');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    const err = new RegAuthError('Необходима авторизация');

    next(err);
  }

  req.user = payload;

  next();
};
