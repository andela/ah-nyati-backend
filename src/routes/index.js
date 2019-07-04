import express from 'express';
import userRoute from './auth';

const router = express.Router();

router.use('/api/v1', userRoute);

export default router;
