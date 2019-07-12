import express from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import socialRoute from './socialRoute';
import likeRoute from './likeRoute';
import articleRoute from './articleRoute';
import commentRoute from './commentRoute';
import ratingRoute from './ratingRoute';

const router = express.Router();

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/auth', socialRoute);
router.use('/api/v1', likeRoute);
router.use('/api/v1/user', userRoute);
router.use('/api/v1/', articleRoute);
router.use('/api/v1', userRoute);
router.use('/api/v1/articles', commentRoute);
router.use('/api/v1/article', commentRoute);
router.use('/api/v1', ratingRoute);

export default router;
