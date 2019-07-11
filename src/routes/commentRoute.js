import express from 'express';

// middelwares
import CommentController from '../controllers/CommentController';
import verify from '../helpers/verifyToken';
import CommentValidation from '../middleware/CommentValidation';
import FindItem from '../helpers/findItem';
import validate from '../middleware/validate';


const router = express.Router();

const { validateComment } = CommentValidation;


router.post(
  '/:slug/comments',
  verify,
  FindItem.getArticle,
  validateComment,
  validate,
  CommentController.addCommentToArticle,
);

router.get(
  '/:slug/comments',
  verify,
  FindItem.findArticle,
  CommentController.getAllArticleComments,
);

export default router;
