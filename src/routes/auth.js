import express from 'express';
import UserController from '../controllers/auth';
import authValidator from '../middleware/authValidator';
import validate from '../middleware/validate';
import checkDuplicate from '../middleware/checkDuplicate';

const { usernameValidator, emailValidator, passwordValidator } = authValidator;
const { checkExistingUser } = checkDuplicate;

const router = express.Router();
router.post('/auth/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  validate,
  checkExistingUser,
  UserController.createAccount);
router.post('/auth/logout', UserController.logOut);

router.post('/auth/logout', UserController.logOut);


export default router;
