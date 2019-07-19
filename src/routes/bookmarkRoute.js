import express from 'express';
import BookmarkController from '../controllers/bookmarkController';
import verify from '../helpers/verifyToken';
import findItem from '../helpers/findItem';


const router = express.Router();

router.post('/articles/bookmark/:slug', verify, findItem.findArticle, BookmarkController.bookmarkArticles);

export default router;
