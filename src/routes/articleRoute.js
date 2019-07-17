import express from 'express';
import ArticleController from '../controllers/articleController';
import validateSearchInput from '../middleware/searchInputValidator';
import articleValidator from '../middleware/articleValidator';
import validate from '../middleware/validate';
import upload from '../helpers/profilePic';
import verify from '../helpers/verifyToken';

const router = express.Router();
const { create } = ArticleController;
const { detailsValidator } = articleValidator;

router.get('/articles', validateSearchInput, ArticleController.search);

router.post('/articles/', verify, upload.array('images', 10), detailsValidator, validate, create);

export default router;
