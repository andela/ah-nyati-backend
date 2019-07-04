import passwordHash from 'password-hash';
import { Blacklist, User } from '../db/models';
import Auth from '../helpers/helpers';
import sendEmail from '../helpers/mail/mailer';
import mailTemplate from '../helpers/mail/mailerTemplate';

const { generateToken } = Auth;

/**
 *
 *
 * @class AuthController
 */
class AuthController {
  /**
  *
  * @constructor
  * @description signup a user
  * @static
  * @param {object} req
  * @param {object} res
  * @memberof AuthController
  */
  static async createAccount(req, res) {
    try {
      const {
        userName, email, password
      } = req.body;
      const hashedpassword = passwordHash.generate(password);
      const values = {
        userName, email, password: hashedpassword
      };
      const result = await User.create(values);
      const { id } = result;
      const token = await generateToken({ id, userName, email });
      const user = {
        id: result.id,
        userName: result.userName,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };

      await sendEmail
        .sendEmail('do_not_reply@authorhaven.com',
          email, 'User Account Registration', mailTemplate(token));

      return res.status(201).json({
        status: 201,
        message: 'User signup successful',
        data: [{ token, user }],
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  // eslint-disable-next-line valid-jsdoc
  /**
  *
  *@description Logout a user
  * @static
  * @param {object} req
  * @param {object} res
  * @returns {object}
  * @memberof AuthController
  */
  static async logOut(req, res) {
    const { token } = req.headers || req.body || req.query;
    try {
      const createdToken = await Blacklist.create({
        token
      });
      return res.status(201).json({
        status: 201,
        message: 'User successfully Logged Out',
        data: createdToken
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }
}

export default AuthController;
