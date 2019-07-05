import passwordHash from 'password-hash';
import sendEmail from '../helpers/mail/mailer';
import mailTemplate from '../helpers/mail/mailTemplate';
import { Blacklist, User } from '../db/models';
import auth from '../middleware/Auth';

/**
 *
 *
 * @class UserController
 */
class AuthController {
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
    const {
      email,
      password
    } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email
        }
      });

      if (user !== null) {
        const logUser = await User.findOne({
          where: {
            email,
            password
          }
        });

        const userToken = await auth.authenticate(logUser);
        if (logUser !== null) {
          return res.status(200).json({
            status: 200,
            message: 'User successfully Logged In',
            data: userToken
          });
        }
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
    const {
      token
    } = req.headers || req.body || req.query;
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
      const {
        email
      } = req.body;
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
      const {
        email
      } = req.body;
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
      const {
        resetToken
      } = req.query;
      const {
        password
      } = req.body;
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
