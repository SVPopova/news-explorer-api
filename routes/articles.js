const router = require('express').Router();
const {
  validateArticle,
  validateArticleId,
} = require('../middlewares/validation');

const {
  findArticle,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.get('/', findArticle);
router.post('/', validateArticle, createArticle);
router.delete('/:articleId', validateArticleId, deleteArticle);

module.exports = router;
