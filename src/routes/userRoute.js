import express from 'express';
import UserController from '../controllers/userController';

const router = express.Router();

<<<<<<< HEAD
router.post('/auth/login', UserController.login);
=======
router.get('/auth/login', UserController.login);
>>>>>>> feature(signout backend): User signout backend-create user controller-add a signout function-create a blacklist model-create logout route[Delivers #166841010]
router.post('/auth/logout', UserController.logOut);

export default router;
