import express from 'express';
import UserController from '../controllers/auth';

const router = express.Router();

router.post('/auth/signup', UserController.createAccount);
router.post('/auth/logout', UserController.logOut);

export default router;
