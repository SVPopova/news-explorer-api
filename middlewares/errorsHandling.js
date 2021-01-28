const { serverErrorMessage } = require("../errors/errorsMessage");

module.exports.errHandler = ((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  res.status(err.statusCode || 500).send({ message: err.status === 500 ? serverErrorMessage : err.message });
  next();
});
