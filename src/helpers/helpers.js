import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import passwordHash from 'password-hash';
import config from '../db/config/config';
import { User } from '../db/models';

const { secret } = config;
/**
 * Handles access token generation and verification
 */
class Auth {
  /**
   * @description Handles access token generation
   * @param {object} payload - The user credential {id, username, email}
   * @return {string} access token
   */
  static generateToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  /**
   * @description Decodes the access token
   * @param {string} token - The access token
   * @returns {object} payload - the decoded access token
   */
  /**
   * @description Decodes the access token
   * @param {string} email - The user's email
   * @param {string} username - The user's username
   * @returns {boolean} True if user exist
   * @returns {boolean} False if user does not exist
   */
  static async checkUserExist(email, username) {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      }
    });
    return existingUser;
  }

  /**
  * @description compares user password
  * @param {string} hashedPassword - The hashed password in thje database to be compared
  * @param {string} password - The unhashed password to be compared
  * @returns {boalean } True - If the are the same
  * @returns {boalean } False - If the are not the same
  */
  static async comparePassword(hashedPassword, password) {
    return passwordHash.verify(password, hashedPassword);
  }
}

export default Auth;
