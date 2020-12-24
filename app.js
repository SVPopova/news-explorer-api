const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { usersRouter, articlesRouter } = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users.js');
const { validUserLoginReg } = require('./middlewares/validation.js');
const NotFoundError = require('./errors/NotFoundError');
require('dotenv').config();

const app = express();
const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use('*', cors({ origin: 'http://svpopova.students.nomoredomains.work' }));
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestLogger);

app.post('/signin', validUserLoginReg, login);
app.post('/signup', validUserLoginReg, createUser);

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errors());

app.use(errorLogger);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  res.status(err.statusCode || 500).send({ message: err.status === 500 ? 'Ошибка сервера' : err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
