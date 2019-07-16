import express from 'express';
import AuthController from '../controllers/authController';
import authValidator from '../middleware/authValidator';
import validate from '../middleware/validate';
import checkDuplicate from '../middleware/checkDuplicate';
import ValidateToken from '../middleware/ValidateToken';
import generateToken from '../middleware/tokenGenerator';
import findItem from '../helpers/findItem';

const router = express.Router();

const { usernameValidator, roleValidator, emailValidator, passwordValidator } = authValidator;
const { checkExistingUser } = checkDuplicate;

router.post('/signup',
  usernameValidator,
  emailValidator,
  roleValidator,
  passwordValidator,
  validate,
  checkExistingUser,
  AuthController.createAccount);

router.get('/verify/:token', AuthController.verifyAccount);
router.post('/login', emailValidator, passwordValidator, validate, AuthController.login);

router.post('/logout', ValidateToken.checkToken, AuthController.logOut);
router.post(
  '/sendResetToken',
  findItem.findUserByEmail,
  generateToken.passwordResetTokenGenerate,
  AuthController.sendResetToken
);
router.post(
  '/resetPassword',
  generateToken.resetPasswordVerifyToken,
  AuthController.resetPassword
);


export default router;
