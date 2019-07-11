import express from 'express';
import RatingController from '../controllers/ratingController';
import verify from '../helpers/verifyToken';
import findItem from '../helpers/findItem';
import ratingChecker from '../middleware/validators/ratingValidation';


const router = express.Router();

router.post('/articles/rate/:slug', verify, ratingChecker, findItem.getArticle, RatingController.rateArticle);
router.get('/articles/rating/:slug', verify, findItem.getArticle, RatingController.getAllArticlesRating);

export default router;
