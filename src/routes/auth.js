import express from 'express';
import authValidator from '../middleware/authValidator';
import validate from '../middleware/validate';
import checkDuplicate from '../middleware/checkDuplicate';
import AuthController from '../controllers/Auth';

const { usernameValidator, emailValidator, passwordValidator } = authValidator;
const { checkExistingUser } = checkDuplicate;

const router = express.Router();
router.post('/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  validate,
  checkExistingUser,
  AuthController.createAccount);

router.post('/login',
  emailValidator,
  passwordValidator,
  validate,
  AuthController.login);

router.post('/logout', AuthController.logOut);

export default router;
