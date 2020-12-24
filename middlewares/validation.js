const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

function urlValidation(value) {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
}
const validUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).regex(/[^ ]/),
  }),
});
const validUserReg = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).regex(/[^ ]/),
  }),
});
const validUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().max(24).hex(),
  }),
});
const validUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
});
const validUserUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidation).required(),
  }).unknown(true),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidation).required(),
  }).unknown(true),
});
const validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
});
module.exports = {
  validUserLogin,
  validUserReg,
  validUserId,
  validUserUpdate,
  validUserUpdateAvatar,
  validateArticle,
  validateArticleId,
};
