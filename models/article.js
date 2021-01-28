const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /(http|https):\/\/([\w/.!&#@-]*).([a-z]{2,})([\w/.!&#@-]*)/gi;
        return regex.test(v);
      },
      message: 'Нужно указать ссылку',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /(http|https):\/\/([\w/.!&#@-]*).([a-z]{2,})([\w/.!&#@-]*)/gi;
        return regex.test(v);
      },
      message: 'Нужно указать ссылку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('article', articleSchema);
