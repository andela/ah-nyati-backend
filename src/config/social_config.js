import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GitHubStrategy } from 'passport-github';
import { socialCallBack } from '../helpers/helpers';
import { User } from '../db/models/user';
import config from '../db/config/config';

const {
  googleConfig, facebookConfig, twitterConfig, githubConfig
} = config;

const googleStrategy = new GoogleStrategy(googleConfig, socialCallBack);

const facebookStrategy = new FacebookStrategy(facebookConfig, socialCallBack);

const twitterStrategy = new TwitterStrategy(twitterConfig, socialCallBack);

const gitHubStrategy = new GitHubStrategy(githubConfig, socialCallBack);

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
  googleStrategy, facebookStrategy, twitterStrategy, gitHubStrategy, SerializeSetUp
};
