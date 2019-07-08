import bcrypt from 'bcryptjs';
import { Auth, hashPassword } from '../helpers/helpers';
import { Blacklist, User } from '../db/models';
import template from '../helpers/mail/mailTemplate/signupEmailTemplate';
import sendEmail from '../helpers/mail/mailer';
import config from '../db/config/config';
import resetTemplate from '../helpers/mail/mailTemplate/passwordResetTemplate';

const { generateToken, verifyToken } = Auth;
const { isTest } = config;

/**
 * @description Authentication Controller
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
      const hashedpassword = hashPassword(password);
      const values = { userName, email, password: hashedpassword };
      const result = await User.create(values);
      const { id, isVerified } = result;
      const token = await generateToken({ id, email, isVerified });

      const url = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/${token}`;
      const message = template(userName, url);
      if (!isTest) {
        const subject = 'Welcome to Authors Haven';
        await sendEmail
          .sendEmail(
            'do_not_reply@authorhaven.com',
            email,
            subject,
            message
          );
      }
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
 * @description signin a user
 * @static
 * @param {object } req
 * @param { object } res
 * @returns { object } res
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
    try {
      const { email, password } = req.body;
      const result = await User.findOne({ where: { email } });
      if (result) {
        if (bcrypt.compareSync(password, result.password)) {
          const { id, isVerified } = result;
          const token = await generateToken({ id, email, isVerified });

          const user = {
            id: result.id,
            userName: result.userName,
            email: result.email,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
          };

          return res.status(200).json({
            status: 200,
            message: 'User Login successful',
            token,
            data: user
          });
        }
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal Server error' });
    }
  }


  /**
  *
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

  /**
   *
   * @description User should recieve a reset token email
   * @constructor
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} res
   * @memberof AuthController
   */
  static async sendResetToken(req, res) {
    try {
      const user = req.userByEmail;

      if (user.verificationToken === '') {
        const token = req.generate;
        await User.update({
          verificationToken: token
        }, {
          where: {
            email: user.email
          }
        });

        const url = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword?resetToken=${token}&email=${user.email}`;
        const html = resetTemplate(user.userName, url);

        await sendEmail
          .sendEmail(
            'do_not_reply@authorhaven.com',
            user.email,
            'Password Reset',
            html
          );

        // RETURN SUCCESS IF SUCCESSFUL
        return res.status(200).json({
          status: 200,
          message: 'reset code successfully sent to email',
        });
      }

      const url = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword?resetToken=${user.verificationToken}&email=${user.email}`;
      const html = resetTemplate(user.userName, url);

      if (!isTest) {
        await sendEmail
          .sendEmail(
            'do_not_reply@authorhaven.com',
            user.email,
            'Resend Password Reset',
            html
          );
      }

      // RETURN SUCCESS IF SUCCESS
      return res.status(200).json({
        status: 200,
        message: 'reset code resent to your email',
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  /**
   *
   * @description User should be able to reset their password with the token
   * @constructor
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} res
   * @memberof AuthController
   */
  static async resetPassword(req, res) {
    try {
      const { resetToken } = req.query;
      const { password } = req.body;

      // Hashing Password with bcryptjs
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      await User.update({
        password: hash,
        verificationToken: ''
      }, {
        where: {
          verificationToken: resetToken
        }
      });

      // RETURN SUCCESS IF SUCCESS
      return res.status(200).json({
        status: 200,
        message: 'password reset successful',
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }
}

export default AuthController;
