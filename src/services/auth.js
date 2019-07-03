import { User } from '../db/models';
import sendEmail from '../mail/mailer';

/**
 * Auth Services
 * @constructor
 */
class AuthServices {
  /**
   * Send Reset Token
   * @constructor
   * @param {*} email - password data
   * @param {*} token - generate token
   */
  static async sendResetToken(email, token) {
    try {
      let statusCode = '',
        errorMessage = '',
        successMessage = '';
      const errors = {};

      // CHECK IF EMAIL EXIST
      const findUser = await User.findOne({
        where: {
          email
        }
      });

      if (findUser !== null) {
        await User.update({
          token
        }, {
          where: {
            email
          }
        });

        const html = `
            <div>
            Hey there,
            <br />
            <br />
            Here is your password reset code:
            <br />
            <br />
            ${token}
            <br />
            <br />
            <h6>Thank You</h6>
            </div>
            `;

        await sendEmail
          .sendEmail('do_not_reply@authorhaven.com',
            email, 'Password Reset', html);

        // RETURN SUCCESS IF SUCCESS
        statusCode = 200;
        successMessage = 'reset code successfully sent to email';
        return {
          statusCode,
          errorMessage,
          successMessage
        };
      }

      // SET ERROR IF ERROR
      errors.email = 'email does not exist';
      statusCode = 404;
      errorMessage = errors;
      return {
        statusCode,
        errorMessage,
        successMessage
      };
    } catch (err) {
      return err;
    }
  }

  /**
   * Resend Token
   * @constructor
   * @param {*} email - password data
   * @param {*} token - generate token
   */
  static async resendToken(email) {
    try {
      let statusCode = '',
        errorMessage = '',
        successMessage = '';
      const errors = {};

      // CHECK IF EMAIL EXIST
      const findUser = await User.findOne({
        where: {
          email
        }
      });

      if (findUser !== null) {
        const html = `
            <div>
            Hey there,
            <br />
            <br />
            Here is your password reset code:
            <br />
            <br />
            ${findUser.token}
            <br />
            <br />
            <h6>Thank You</h6>
            </div>
            `;

        await sendEmail
          .sendEmail('do_not_reply@authorhaven.com',
            email, 'Resend Password Reset', html);

        // RETURN SUCCESS IF SUCCESS
        statusCode = 200;
        successMessage = 'reset code resent to your email';
        return {
          statusCode,
          errorMessage,
          successMessage
        };
      }

      // SET ERROR IF ERROR
      errors.email = 'email does not exist';
      statusCode = 404;
      errorMessage = errors;
      return {
        statusCode,
        errorMessage,
        successMessage
      };
    } catch (err) {
      return err;
    }
  }

  /**
   * Reset user password
   * @constructor
   * @param {*} password - password data
   * @param {*} token - query
   */
  static async resetPassword(password, token) {
    try {
      let statusCode = '',
        successMessage = '';
      const errorMessage = '';

      // find the token if it exist
      const findToken = await User.findOne({
        where: {
          token
        }
      });

      if (findToken !== null) {
        await User.update({
          password,
          token: ''
        }, {
          where: {
            token
          }
        });

        const html = `
            <div>
            Hey there,
            <br />
            <br />
            You successfully reset your password. You can login now
            <br />
            <br />
            <h6>Thank You</h6>
            </div>
            `;

        await sendEmail
          .sendEmail('do_not_reply@authorhaven.com',
            findToken.email, 'Password Reset Successful', html);

        // RETURN SUCCESS IF SUCCESS
        statusCode = 200;
        successMessage = 'password reset successful';
        return {
          statusCode,
          errorMessage,
          successMessage
        };
      }
    } catch (err) {
      return err;
    }
  }
}

export default AuthServices;
