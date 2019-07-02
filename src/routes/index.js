import express from 'express';
import userRoute from './userRoute';

const router = express.Router();

router.use('/api/v1', userRoute);

export default router;
