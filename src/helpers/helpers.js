import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import config from '../db/config/config';


dotenv.config();
const { secret } = config;

/**
 *
 *@description Handles access token generation and verification
 * @class Auth
 */
export class Auth {
  /**
   * @description Handles access token generation
   * @param {object} payload - The user credential {id, username, email}
   * @return {string} access token
   */
  static generateToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  /**
   *
   *@description Verifies token
   * @param { string } token
   * @returns{ object } user details
   */
  static verifyToken(token) {
    return jwt.verify(token, secret);
  }
}

export const socialCallBack = (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  done(null, accessToken, profile);
};
export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
