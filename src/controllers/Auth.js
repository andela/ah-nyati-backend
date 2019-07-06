import passwordHash from 'password-hash';
import Auth from '../helpers/helpers';
import { Blacklist, User } from '../db/models';
import template from '../helpers/mail/mailTemplate/signupEmailTemplate';
import Mailer from '../helpers/mail/Mailer';

const { generateToken, verifyToken } = Auth;
const { sendMail } = Mailer;

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
      const { userName, email, password } = req.body;
      const hashedpassword = passwordHash.generate(password);
      const values = { userName, email, password: hashedpassword };
      const result = await User.create(values);
      const { id } = result;
      const token = await generateToken({ id, userName, email });

      const url = `${req.protocol}://${req.get('host')}/api/v1/auth/signup/${token}`;
      const message = template(userName, url);
      const subject = 'Welcome to Authors Haven';
      await sendMail({ to: email, subject, html: message });

      return res.status(201).json({
        status: 201,
        message: 'A link has been sent to your mailbox for verification'
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }

  /**
 *
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @returns { object } verified
 * @memberof AuthController
 */
  static async verifyAccount(req, res) {
    try {
      const { token } = req.params;
      const decode = await verifyToken(token);
      if (decode) {
        const { id } = decode;
        const user = await User.findOne({ id });
        if (user) {
          await user.update({ isVerified: true });
          const verifiedUser = {
            userName: user.userName,
            email: user.email,
            isverified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
          return res.status(200).json({
            status: '200',
            message: 'Your account has been verified',
            data: [verifiedUser]
          });
        }
        return res.status(400).json({
          status: '400',
          message: 'Invalid user credential'
        });
      }
      return res.status(400).json({
        status: '400',
        message: 'Invalid user credential'
      });
    } catch (err) {
      return res.status(400).json({
        status: '400',
        message: 'Invalid user credential'
      });
    }
  }

  /**
*
*
* @static
* @param {object} req
* @param {object} res
* @returns {object} res
* @memberof AuthController
*/
  static async login(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['password'] }
      });
      const { id } = user;
      const userToken = Auth.authenticate(id);
      if (user) {
        return res.status(200).json({
          status: 200,
          message: 'User successfully Logged In',
          data: userToken
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error,
      });
    }
  }

  /**
  *
  *@description Logout a user
  * @static
  * @param {object} req
  * @param {object} res
  * @returns {object} res
  * @memberof AuthController
  */
  static async logOut(req, res) {
    const { token } = req.headers || req.body || req.query;
    try {
      const createdToken = await Blacklist.create({
        token
      });
      return res.status(200).json({
        status: 200,
        message: 'User successfully Logged Out',
        data: createdToken
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        data: error,
      });
    }
  }
}

export default AuthController;
