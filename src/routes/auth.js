import express from 'express';
import AuthController from '../controllers/Auth';
import ValidateToken from '../middleware/ValidateToken';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/logout', ValidateToken.checkToken, AuthController.logOut);

export default router;
