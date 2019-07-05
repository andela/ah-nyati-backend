import passwordHash from 'password-hash';
import sendEmail from '../helpers/mail/mailer';
import mailTemplate from '../helpers/mail/mailTemplate';
import { User } from '../db/models';

/**
 *
 *
 * @class UserController
 */
class AuthController {
  /**
   *
   * @constructor
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof AuthController
   */
  static async sendResetToken(req, res) {
    try {
      const { email } = req.body;
      const token = req.generate;
      const errors = {};

      // CHECK IF EMAIL EXIST
      const findUser = await User.findOne({
        where: {
          email
        }
      });

      if (findUser !== null) {
        await User.update({
          verificationToken: token
        }, {
          where: {
            email
          }
        });

        const html = mailTemplate(`${findUser.firstName} ${findUser.lastName}`, `
          Your verification to is: ${token}
        `);

        await sendEmail
          .sendEmail('do_not_reply@authorhaven.com',
            email, 'Password Reset', html);

        // RETURN SUCCESS IF SUCCESS
        return res.status(200).json({
          status: 200,
          message: 'reset code successfully sent to email',
        });
      }

      // SET ERROR IF ERROR
      errors.email = 'email does not exist';
      return res.status(404).json({
        status: 404,
        message: errors,
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
   * @constructor
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof AuthController
   */
  static async resendToken(req, res) {
    try {
      const { email } = req.body;
      const errors = {};

      // CHECK IF EMAIL EXIST
      const findUser = await User.findOne({
        where: {
          email
        }
      });

      if (findUser !== null) {
        const html = mailTemplate(`${findUser.firstName} ${findUser.lastName}`, `
          Your verification to is: ${findUser.verificationToken}
        `);

        await sendEmail
          .sendEmail('do_not_reply@authorhaven.com',
            email, 'Resend Password Reset', html);

        // RETURN SUCCESS IF SUCCESS
        return res.status(200).json({
          status: 200,
          message: 'reset code resent to your email',
        });
      }

      // SET ERROR IF ERROR
      errors.email = 'email does not exist';
      return res.status(404).json({
        status: 404,
        message: errors,
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
   * @constructor
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof AuthController
   */
  static async resetPassword(req, res) {
    try {
      const { resetToken } = req.query;
      const { password } = req.body;
      const hashPassword = passwordHash.generate(password);

      // find the token if it exist
      const findToken = await User.findOne({
        where: {
          verificationToken: resetToken
        }
      });

      if (findToken !== null) {
        await User.update({
          password: hashPassword,
          verificationToken: ''
        }, {
          where: {
            verificationToken: resetToken
          }
        });

        const html = mailTemplate(`${findToken.firstName} ${findToken.lastName}`, `
          You have successfully reset your password
        `);

        await sendEmail
          .sendEmail('do_not_reply@authorhaven.com',
            findToken.email, 'Password Reset Successful', html);

        // RETURN SUCCESS IF SUCCESS
        return res.status(200).json({
          status: 200,
          message: 'password reset successful',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }
}

export default AuthController;
