import express from 'express';

// middelware
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
router.get(
  '/comments/:id',
  verify,
  findItem.findComment,
  CommentController.getSingleComment,
);

router.patch(
  '/comments/:id',
  verify,
  findItem.findComment,
  CommentController.updateComment,
);

router.get(
  '/comments/:id/history',
  verify,
  findItem.findComment,
  CommentController.getCommentHistory,
);

export default router;
