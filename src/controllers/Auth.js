import { Auth, hashPassword } from '../helpers/helpers';
import auth from '../middleware/Auth';
import { Blacklist, User } from '../db/models';
import template from '../helpers/mail/mailTemplate/signupEmailTemplate';
import sendEmail from '../helpers/mail/mailer';

const { generateToken, verifyToken } = Auth;

/**
 *@description - AuthController class
  * @param {object} req
  * @param {object} res
  * @returns {object} response
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
      const hashedpassword = hashPassword(password);
      const values = { userName, email, password: hashedpassword };
      const result = await User.create(values);
      const { id, isVerified } = result;
      const token = await generateToken({ id, email, isVerified });

      const url = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/${token}`;
      const message = template(userName, url);
      const subject = 'Welcome to Authors Haven';
      await sendEmail
        .sendEmail(
          'do_not_reply@authorhaven.com',
          email,
          subject,
          message
        );

      return res.status(201).json({
        status: 201,
        message: 'A link has been sent to your mailbox for verification',
        token
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
*@description logs in autheticated user
* @static
* @param { object } req
* @param { object } res
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
            token
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
 *@description logs in autheticated user
 * @static
 *@description logs in autheticated user
 * @param {object} req the request body
 * @param {object} res the response body
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

      if (!user) {
        return res.status(404).json({
          status: 400,
          error: 'User not found',
        });
      }
      const { id } = user;
      const userToken = auth.authenticate(id);
      if (user) {
        return res.status(200).json({
          status: 200,
          message: 'User successfully Logged In',
          data: userToken
        });
      }
      return res.status(404).json({
        status: 404,
        message: 'User Not Found',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  /**
  *@static
  *@description Logout a user
  * @param {object} req the request body
  * @param {object} res the response body
  * @returns {object} res
  * @memberof AuthController
  */
  static async logOut(req, res) {
    const { token } = req.headers || req.body || req.query;
    try {
      await Blacklist.create({
        token
      });
      return res.status(200).json({
        status: 200,
        message: 'User successfully Logged Out',
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
