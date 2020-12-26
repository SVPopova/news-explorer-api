const jwt = require('jsonwebtoken');
const RegAuthError = require('../errors/RegAuthError');
const { DEV_SECRET } = require('../config');
const { badAuthMessage, authMessage } = require('../errors/errorsMessage');

const { NODE_ENV, JWT_SECRET, DEV_SECRET_KEY = DEV_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new RegAuthError(badAuthMessage);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET_KEY);
  } catch (e) {
    const err = new RegAuthError(authMessage);

    next(err);
  }

  req.user = payload;

  next();
};
