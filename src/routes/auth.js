import express from 'express';
import AuthController from '../controllers/auth';
import generateToken from '../middleware/tokenGenerator';

const router = express.Router();

router.post('/auth/sendResetToken',
  generateToken.tokenGenerate,
  AuthController.sendResetToken);
router.post('/auth/resendToken',
  AuthController.resendToken);
router.post('/auth/resetPassword',
  generateToken.verifyToken,
  AuthController.resetPassword);

export default router;
