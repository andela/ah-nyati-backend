import express from 'express';
import UserController from '../controllers/user';
import generateToken from '../middleware/tokenGenerator';

const router = express.Router();
const {
  followUser,
  unFollowUser
} = UserController;


router.post('/follow/:userId',
  generateToken.verifyToken,
  followUser);
router.post('/unfollow/:userId',
  generateToken.verifyToken,
  unFollowUser);

export default router;
