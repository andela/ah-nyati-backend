// third-party libraries
import jwt from 'jsonwebtoken';
import config from '../db/config/config';

const { secret } = config;

/**
 * @static
 * @constructor {object} auth
 */
const auth = {
  /**
   *
   * @static
   * @param {string} user
   * @description Generates token for user
   * @return {string} string
   */
  authenticate(user) {
    return jwt.sign(
      {
        user,
      },
      secret,
      {
        expiresIn: '24h',
      },
    );
  },
};

export default auth;
