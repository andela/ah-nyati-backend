import express from 'express';
import AuthController from '../controllers/Auth';
import authValidator from '../middleware/authValidator';
import validate from '../middleware/validate';
import checkDuplicate from '../middleware/checkDuplicate';
import ValidateToken from '../middleware/ValidateToken';

const router = express.Router();

const { usernameValidator, emailValidator, passwordValidator } = authValidator;
const { checkExistingUser } = checkDuplicate;

router.post('/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  validate,
  checkExistingUser,
  AuthController.createAccount);

router.get('/verify/:token', AuthController.verifyAccount);
router.post('/login', emailValidator, passwordValidator, validate, AuthController.login);

/**
* @swagger
*
* /auth/google:
*   get:
*     tags:
*       - auth
*     description: Google Social Login
*     produces:
*       - application/json
*     responses:
*       201:
*         description: Success
*/
router.post('/login', AuthController.login);
router.post('/logout', ValidateToken.checkToken, AuthController.logOut);

/**
* @swagger
*
* /auth/google:
*   post:
*     tags:
*       - auth
*     description: Google Social Login
*     produces:
*       - application/json
*     responses:
*       201:
*         description: Success
*/
router.post('/logout', AuthController.logOut);

export default router;
