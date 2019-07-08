import express from 'express';
import authRoute from './auth';
import socialRoute from './socialRoute';

const router = express.Router();

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/auth', socialRoute);

export default router;
