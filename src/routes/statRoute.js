import express from 'express';
import UserController from '../controllers/userController';
import verify from '../helpers/verifyToken';

const router = express.Router();

router.get('/stats',
  verify,
  UserController.getUserReadStat);

  export default router;
  