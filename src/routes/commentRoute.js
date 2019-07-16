import express from 'express';

// middelwares
import CommentController from '../controllers/CommentController';
import verify from '../helpers/verifyToken';
import CommentValidation from '../middleware/CommentValidation';
import findItem from '../helpers/findItem';
import validate from '../middleware/validate';


const router = express.Router();

const { validateComment, validateCommentId } = CommentValidation;


router.post(
  '/:slug/comments',
  verify,
  findItem.getArticleWithAuthor,
  validateComment,
  validate,
  CommentController.addCommentTocomment,
);

router.get(
  '/:slug/comments',
  verify,
  findItem.findArticle,
  CommentController.getAllArticleComments,
);

router.post(
  '/comments/:id/like',
  verify,
  validateCommentId,
  validate,
  findItem.findComment,
  CommentController.likeComment,
  );

export default router;
