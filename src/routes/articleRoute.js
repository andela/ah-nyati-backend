import { Router } from 'express';
import articleController from '../controllers/articleController';
import validateSearchInput from '../middleware/searchInputValidator';

const articleRouter = new Router();


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
articleRouter.get('/articles', validateSearchInput, articleController.search);


export default articleRouter;
