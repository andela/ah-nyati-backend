import express from 'express';
import UserController from '../controllers/userController';

const router = express.Router();

router.get('/auth/login', UserController.login);
router.post('/auth/logout', UserController.logOut);

export default router;
