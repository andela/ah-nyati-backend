// third-party libraries
import jwt from 'jsonwebtoken';
import config from '../db/config/config';

const { secret } = config;

const auth = {
  /**
   * @static
   * @param {object} user
   * @description Generates token for user
   * @return {string} string
   */
  authenticate(user) {
    return jwt.sign(
      {
        id: user.id,
      },
      secret,
      {
        expiresIn: '24h'
      }
    );
  }
};

export default auth;
