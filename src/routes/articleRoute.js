import express from 'express';
import ArticleController from '../controllers/articleController';
import validateSearchInput from '../middleware/searchInputValidator';
import articleValidator from '../middleware/articleValidator';
import highlightValidator from '../middleware/highlightValidator';
import validate from '../middleware/validate';
import authorize from '../middleware/authorize';
import upload from '../helpers/profilePic';
import verify from '../helpers/verifyToken';
import findItem from '../helpers/findItem';
import checkCategoryExists from '../middleware/checkCategoryExists';
import roles from '../helpers/helperData/roles';

const router = express.Router();
const { createArticle, getArticle, highlightAndComment } = ArticleController;
const { detailsValidator } = articleValidator;
const { allRoles } = roles;
const { validatehighlight, validateComment } = highlightValidator;

router.get('/articles', validateSearchInput, ArticleController.search);
router.get(
  '/articles/:slug',
  findItem.findArticle,
  getArticle
);
router.post(
  '/articles/',
  verify,
  authorize(allRoles),
  upload.array('images', 10),
  detailsValidator,
  validate,
  checkCategoryExists,
  createArticle
);
router.post(
  '/articles/highlight/:slug',
  verify,
  findItem.getArticleWithAuthor,
  validatehighlight,
  validateComment,
  validate,
  highlightAndComment
);

export default router;
