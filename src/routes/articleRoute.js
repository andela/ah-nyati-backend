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
router.post('/articles/', verify, upload.array('images', 10), detailsValidator, validate, create);

export default router;
