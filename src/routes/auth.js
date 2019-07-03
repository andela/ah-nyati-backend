import express from 'express';
import AuthController from '../controllers/auth';
import generateToken from '../middleware/tokenGenerator';

const router = express.Router();
const {
  sendResetToken,
  resendToken,
  resetPassword
} = AuthController;


router.post('/sendResetToken',
  generateToken.tokenGenerate,
  sendResetToken);
router.post('/resendToken', resendToken);
router.post('/resetpassword',
  generateToken.verifyToken,
  resetPassword);

export default router;
