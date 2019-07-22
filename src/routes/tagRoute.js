import express from 'express';
import TagController from '../controllers/tagController';
import verify from '../helpers/verifyToken';
import findItem from '../helpers/findItem';
import tagChecker from '../middleware/validators/tagValidator'


const router = express.Router();

router.post('/articles/tag/:slug', verify, tagChecker, findItem.findArticle, TagController.tagArticles);

export default router;
