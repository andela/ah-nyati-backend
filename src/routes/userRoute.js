import express from 'express';
import UserController from '../controllers/userController';
import verify from '../helpers/verifyToken';
import upload from '../helpers/profilePic';
import profileChecker from '../middleware/validators/profileValidator';
import findItem from '../helpers/findItem';

const router = express.Router();

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

export default router;
