import express from 'express';
import authRoute from './auth';

const router = express.Router();

router.use('/api/v1', authRoute);

export default router;
