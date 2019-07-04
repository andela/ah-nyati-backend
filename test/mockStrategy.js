/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
import passport from 'passport';
import { randomSocialUser } from './mockUser';
import { socialCallBack } from '../src/helpers/helpers';


class MockStrategy extends passport.Strategy {
  /**
     * @param {}
     * @param {}
     * @param {}
     */
  constructor(name, callback, user) {
    super(name, callback);
    this.name = name;
    this.cb = callback;
    this.user = { ...user, provider: name };
  }

  /**
     * @memberof MockStrategy
     * @returns {undefined}
     */
  authenticate() {
    this.cb(null, null, this.user, (error, user) => {
      this.success(user);
    });
  }
}

passport.use(new MockStrategy('google', socialCallBack, randomSocialUser));
passport.use(
  new MockStrategy('facebook', socialCallBack, randomSocialUser)
);
passport.use(new MockStrategy('twitter', socialCallBack, randomSocialUser));

export { MockStrategy, randomSocialUser };
