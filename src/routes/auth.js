import express from 'express';
import AuthController from '../controllers/Auth';
import generateToken from '../middleware/tokenGenerator';

const router = express.Router();

router.post(
  '/sendResetToken',
  generateToken.tokenGenerate,
  AuthController.sendResetToken
);
router.post(
  '/resendToken',
  AuthController.resendToken
);
router.post(
  '/resetPassword',
  generateToken.verifyToken,
  AuthController.resetPassword
);

export default router;
