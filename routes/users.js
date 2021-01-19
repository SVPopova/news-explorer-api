const router = require('express').Router();
const {
  findUserMe,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.get('/me', findUserMe);

module.exports = router;
