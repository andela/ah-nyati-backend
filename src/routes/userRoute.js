import express from 'express';
import UserController from '../controllers/userController';
import verify from '../helpers/verifyToken';
import upload from '../helpers/profilePic';
import profileChecker from '../middleware/validators/profileValidator';
import findItem from '../helpers/findItem';
import validate from '../middleware/validate';
import authorize from '../middleware/authorize';
import userValidator from '../middleware/userValidator';
import roles from '../helpers/helperData/roles';

const router = express.Router();
const { superAdmin } = roles;
const { idParamValidator, roleValidator } = userValidator;

router.get('/profiles/:userName',
  verify,
  UserController.getUserProfile);

router.get('/profiles/',
  verify,
  UserController.getAllAuthorsProfile);

router.put('/profiles/:id',
  verify, upload.single('avatar'),
  profileChecker,
  UserController.updateProfile);
  
router.post(
  '/follow/:userId',
  verify,
  findItem.findUser,
  findItem.checkIfFollowingSelf,
  UserController.followSystem
);
router.put('/access/:userId',
  verify,
  authorize(superAdmin),
  roleValidator,
  idParamValidator,
  validate,
  findItem.findUser,
  UserController.changeAccessLevel
);
router.delete('/:userId',
  verify,
  authorize(superAdmin),
  idParamValidator,
  validate,
  findItem.findUser,
  UserController.deleteUser
);
router.get(
  '/followers/:userId',
  verify,
  UserController.getUserFollowers
);
router.get(
  '/followees/:userId',
  verify,
  UserController.getUserFollowee
);
router.get(
  '/notification',
  verify,
  findItem.getUserNotification,
  UserController.getUserNotification
);
router.post(
  '/notification/:notifyId',
  verify,
  UserController.updateUserNotification
);
router.post(
  '/notification/disable/:userId',
  verify,
  UserController.disableUserNotification
);

export default router;
