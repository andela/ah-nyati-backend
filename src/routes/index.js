import { Router } from 'express';
import socialRouter from './socialRoute';

const router = new Router();

router.use('/auth', socialRouter);

export default router;
