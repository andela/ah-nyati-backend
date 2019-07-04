import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import dotenv from 'dotenv';
import { socialCallBack } from '../helpers/helpers';
import { User } from '../db/models/user';

dotenv.config();

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
};

const googleStrategy = new GoogleStrategy(googleConfig, socialCallBack);

const facebookConfig = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'name', 'displayName', 'email', 'photos']
};

const facebookStrategy = new FacebookStrategy(facebookConfig, socialCallBack);

const twitterConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  includeEmail: true,
  includeName: true
};

const twitterStrategy = new TwitterStrategy(twitterConfig, socialCallBack);

const SerializeSetUp = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(done);
  });
};

export {
  googleStrategy, facebookStrategy, twitterStrategy, SerializeSetUp
};
