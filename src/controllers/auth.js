import AuthServices from '../services/auth';
import statusCheckerHelper from '../helpers/statusChecker';

const {
  statusChecker
} = statusCheckerHelper;

const {
  sendResetToken,
  resendToken,
  resetPassword
} = AuthServices;

/**
 * Auth Services
 * @constructor
 */
class AuthController {
  /**
   * Send Reset Token
   * @constructor
   * @param {*} req - req
   * @param {*} res - res
   */
  static async sendResetToken(req, res) {
    try {
      const { email } = req.body;
      const {
        statusCode,
        errorMessage,
        successMessage
      } = await sendResetToken(email, req.generate);

      const response = await statusChecker(
        req,
        res,
        statusCode,
        errorMessage,
        successMessage
      );
      return response;
    } catch (err) {
      return err;
    }
  }

  /**
   * Resend Token
   * @constructor
   * @param {*} req - req
   * @param {*} res - res
   */
  static async resendToken(req, res) {
    try {
      const {
        email
      } = req.body;
      const {
        statusCode,
        errorMessage,
        successMessage
      } = await resendToken(email);

      const response = await statusChecker(
        req,
        res,
        statusCode,
        errorMessage,
        successMessage
      );
      return response;
    } catch (err) {
      return err;
    }
  }

  /**
   * Reset user password
   * @constructor
   * @param {*} req - req
   * @param {*} res - res
   */
  static async resetPassword(req, res) {
    try {
      const { resetToken } = req.query;
      const { password } = req.body;
      const {
        statusCode,
        errorMessage,
        successMessage
      } = await resetPassword(password, resetToken);

      const response = await statusChecker(
        req,
        res,
        statusCode,
        errorMessage,
        successMessage
      );
      return response;
    } catch (err) {
      return err;
    }
  }
}

export default AuthController;
