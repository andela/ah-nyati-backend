import express from 'express';
import AuthController from '../controllers/Auth';

const router = express.Router();

router.post('/signup', AuthController.createAccount);
router.get('/signup/:token', AuthController.verifyAccount);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logOut);

export default router;
