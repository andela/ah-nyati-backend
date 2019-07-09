import express from 'express';
import UserController from '../controllers/userController';
import verify from '../helpers/verifyToken';
import upload from '../helpers/profilePic';
import profileChecker from '../middleware/validators/profileValidator';

const router = express.Router();

router.get('/profiles/:userName',
  verify,
  UserController.getUserProfile);

router.put('/profiles/:id',
  verify, upload.single('avatar'),
  profileChecker,
  UserController.updateProfile);

export default router;
