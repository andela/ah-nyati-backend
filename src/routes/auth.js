import express from 'express';
import AuthController from '../controllers/auth';
import generateToken from '../middleware/tokenGenerator';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logOut);
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
