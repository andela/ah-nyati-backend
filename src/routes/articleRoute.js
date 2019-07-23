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

/**
 * @swagger
 *
 * /articles:
 *   post:
 *     description: filter article by author, tag, category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: search Parameter
 *         description: keyword to search article by.
 *         in: query
 *         type: string
 *       - name: search word
 *         description: string to be searched for.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: search article
 */
router.get('/articles', validateSearchInput, ArticleController.search);

router.post('/articles/', verify, upload.array('images', 10), detailsValidator, validate, createArticle);


router.get('/articles/:slug', findItem.findArticle, getArticle);

export default router;
