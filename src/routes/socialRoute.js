import { Router } from 'express';
import passport from 'passport';
import socialLogin from '../controllers/socialController';

const socialRouter = new Router();

socialRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

socialRouter.get('/google/callback', passport.authenticate('google'), socialLogin.socialUser);

socialRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

socialRouter.get('/facebook/callback', passport.authenticate('facebook'), socialLogin.socialUser);

socialRouter.get('/twitter', passport.authenticate('twitter', { scope: ['email'] }));

socialRouter.get('/twitter/callback', passport.authenticate('twitter'), socialLogin.socialUser);

socialRouter.get('/github', passport.authenticate('github', { scope: ['email'] }));

socialRouter.get('/github/callback', passport.authenticate('github'), socialLogin.socialUser);


export default socialRouter;
