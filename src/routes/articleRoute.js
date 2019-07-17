import express from 'express';
import ArticleController from '../controllers/articleController';
import validateSearchInput from '../middleware/searchInputValidator';
import articleValidator from '../middleware/articleValidator';
import validate from '../middleware/validate';
import upload from '../helpers/profilePic';
import verify from '../helpers/verifyToken';
import findItem from '../helpers/findItem';
import checkCategoryExists from '../middleware/checkCategoryExists';

const router = express.Router();
const { createArticle, getArticle } = ArticleController;
const { detailsValidator } = articleValidator;

router.get('/articles', validateSearchInput, ArticleController.search);
router.get(
  '/articles/:slug',
  findItem.findArticle,
  getArticle
);
router.post('/articles/', verify, upload.array('images', 10), detailsValidator, validate, checkCategoryExists, createArticle);

export default router;
