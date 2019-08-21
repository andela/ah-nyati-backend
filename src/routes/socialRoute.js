import { Router } from 'express';
import passport from 'passport';
import socialLogin from '../controllers/socialController';

const socialRoute = new Router();

socialRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

socialRoute.get('/google/callback', passport.authenticate('google'), socialLogin.socialUser);

socialRoute.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

socialRoute.get('/facebook/callback', passport.authenticate('facebook'), socialLogin.socialUser);

socialRoute.get('/twitter', passport.authenticate('twitter', { scope: ['email'] }));

socialRoute.get('/twitter/callback', passport.authenticate('twitter'), socialLogin.socialUser);

socialRoute.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

socialRoute.get('/github/callback', passport.authenticate('github'), socialLogin.socialUser);


export default socialRoute;
