import express from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import socialRoute from './socialRoute';
import likeRoute from './likeRoute';
import commentRoute from './commentRoute';
import ratingRoute from './ratingRoute';
import bookmarkRoute from './bookmarkRoute'
import tagRoute from './tagRoute';
import reportRoute from './reportRoute';
import articleRoute from './articleRoute';

const router = express.Router();

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/auth', socialRoute);
router.use('/api/v1', likeRoute);
router.use('/api/v1/user', userRoute);
router.use('/api/v1/', articleRoute);
router.use('/api/v1/articles', commentRoute);
router.use('/api/v1', ratingRoute);
router.use('/api/v1', bookmarkRoute);
router.use('/api/v1', tagRoute);
router.use('/api/v1', reportRoute);


export default router;
