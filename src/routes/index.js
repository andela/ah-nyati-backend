import express from 'express';
import authRoute from './auth';
import userRoute from './userRoute';
import socialRoute from './socialRoute';

const router = express.Router();

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/auth', socialRoute);
router.use('/api/v1', userRoute);

export default router;
