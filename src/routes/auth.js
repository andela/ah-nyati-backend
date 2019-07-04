import express from 'express';
import UserController from '../controllers/Auth';

const router = express.Router();
router.post('/auth/signup', UserController.createAccount);
router.post('/auth/logout', UserController.logOut);
