import express from 'express';
import LikeController from '../controllers/likeController';
import verify from '../helpers/verifyToken';
import findItem from '../helpers/findItem';

const router = express.Router();

router.post('/articles/:slug/like',
  verify,
  findItem.getArticle,
  LikeController.likeArticle);

export default router;
