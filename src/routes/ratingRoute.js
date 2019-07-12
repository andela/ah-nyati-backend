import express from 'express';
import RatingController from '../controllers/ratingController';
import verify from '../helpers/verifyToken';
import findItem from '../helpers/findItem';
import ratingChecker from '../middleware/validators/ratingValidation';


const router = express.Router();

router.post('/articles/rate/:slug', verify, ratingChecker, findItem.findArticle, RatingController.rateArticle);
router.get('/articles/rating/:slug', verify, findItem.findArticle, RatingController.getAllArticlesRating);

export default router;
