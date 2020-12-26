const article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { notFoundMessageArticle, forbiddenErrorMessageArticle, notFoundMessage } = require('../errors/errorsMessage');

module.exports.findArticle = (req, res, next) => {
  article.find({})
    .then((info) => {
      if (!info) {
        throw new NotFoundError(notFoundMessage);
      }
      return res.send(info);
    })
    .catch(next);
};
module.exports.createArticle = (req, res, next) => {
  const owner = req.user._id;
  article.create({ owner, ...req.body })
    .then((info) => {
      if (!info) {
        throw new NotFoundError(notFoundMessage);
      }
      return res.send(info);
    })
    .catch(next);
};
module.exports.deleteArticle = (req, res, next) => {
  article.findById(req.params.articleId)
    .then((info) => {
      if (!info) {
        throw new NotFoundError(notFoundMessageArticle);
      }
      if (info.owner.toString() === req.user._id.toString()) {
        info.deleteOne(info)
          .then((data) => {
            if (!data) {
              throw new NotFoundError(notFoundMessageArticle);
            }
            res.send({ data });
          })
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenErrorMessageArticle);
      }
    })
    .catch(next);
};
