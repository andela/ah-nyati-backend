import express from 'express';
import userRoute from './auth';
import authRoute from './authRoute';

const router = express.Router();

router.use('/api/v1', userRoute);
router.use('/', authRoute);

export default router;
