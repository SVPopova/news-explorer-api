const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { usersRouter, articlesRouter } = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users.js');
const { validUserLogin, validUserReg } = require('./middlewares/validation.js');
const NotFoundError = require('./errors/NotFoundError');
const { MONGOURL, RATELIMWIN, RATELIMMAX } = require('./config');
const { serverErrorMessage } = require('./errors/errorsMessage');
const { errHandler } = require('./middlewares/errorsHandling.js');
require('dotenv').config();

const app = express();
const { PORT = 3000, MONGODB = MONGOURL } = process.env;
const limiter = rateLimit({
  windowMs: RATELIMWIN,
  max: RATELIMMAX,
});

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use('*', cors());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(serverErrorMessage);
  }, 0);
});
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestLogger);

app.post('/signin', validUserLogin, login);
app.post('/signup', validUserReg, createUser);

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.all('*', () => {
  throw new NotFoundError(serverErrorMessage);
});

app.use(errors());

app.use(errorLogger);

app.use(errHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
