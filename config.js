const MONGOURL = 'mongodb://localhost:27017/newsbrowser';
const DEV_SECRET = 'dev-secret';
const RATELIMWIN = 15 * 60 * 1000;
const RATELIMMAX = 10000;

module.exports = {
  MONGOURL,
  DEV_SECRET,
  RATELIMWIN,
  RATELIMMAX,
};
