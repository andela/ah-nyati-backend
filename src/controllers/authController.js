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
      const { userName, email, password, userRole } = req.body;
      const hashedpassword = hashPassword(password);

      const role = userRole || 'user';
      const values = { userName, email, password: hashedpassword, role };
      const result = await User.create(values);
      const { id, isVerified } = result;
      const token = await generateToken({ id, email, isVerified, role });

      const url = `https://ah-nyati-frontend.herokuapp.com/dashboard?verifyToken=${token}`;
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
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
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
            status: 200,
            message: 'Your account has been verified',
            token: verifiedUser.token
          });
        }
        return res.status(400).json({
          status: 400,
          message: 'Invalid user credential'
        });
      }
      return res.status(400).json({
        status: 400,
        message: 'Invalid user credential'
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message
      });
    }
  }

  /**
 *
 *@description logs in autheticated user
 * @static
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
          const { id, isVerified, role } = result;
          const token = await generateToken({ id, email, isVerified, role });

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
            data: [ user ]
          });
        }
        return res.status(401).json({
          status: 401,
          message: 'Invalid email or password'
        });
      }
      return res.status(401).json({
        status: 401,
        message: 'Invalid email or password'
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
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
        message: 'User successfully logged out',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
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
       
        const url = `https://ah-nyati-frontend.herokuapp.com/newpassword?resetToken=${token}&email=${user.email}`;
        const html = resetTemplate(user.userName, url);

        if (!isTest) {
          await sendEmail
            .sendEmail(
              'do_not_reply@authorhaven.com',
              user.email,
              'Password Reset',
              html
            );
        }

        // RETURN SUCCESS IF SUCCESSFUL
        return res.status(200).json({
          status: 200,
          message: 'reset code successfully sent to email',
        });
      }

      const url = `https://ah-nyati-frontend.herokuapp.com/newpassword?resetToken=${user.verificationToken}&email=${user.email}`;
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
        message: 'A reset code has been resent to your email',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
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
        message: 'Password reset successful',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
}

export default AuthController;
