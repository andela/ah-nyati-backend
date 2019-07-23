import jwt from 'jsonwebtoken';
import { GENERATE_SECRET } from '../db/config/config';
import { User } from '../db/models';

/**
 *
 *
 * @description Password Reset Controller
 * @class TokenGenerator
 */
class TokenGenerator {
  /**
   *
   * @description Generates Token
   * @constructor
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} res
   * @memberof TokenGenerator
   */
  static passwordResetTokenGenerate(req, res, next) {
    const { email } = req.body;
    const payload = {
      email
    };
    jwt.sign(
      payload,
      GENERATE_SECRET, {
        expiresIn: '1h'
      },
      async (err, token) => {
        req.generate = token;
        return next();
      }
    );
  }

  /**
   *
   * @description Verify Password Reset Token
   * @constructor
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} res
   * @memberof TokenGenerator
   */
  static resetPasswordVerifyToken(req, res, next) {
    jwt.verify(
      req.query.resetToken,
      GENERATE_SECRET,
      async (err, authorizedData) => {
        if (err) {
          const { email } = req.query;
          if (email !== undefined) {
            await User.update({
              verificationToken: ''
            }, {
              where: {
                email
              }
            });
            return next();
          }
          return res.status(400).json({
            status: 400,
            message: 'invalid token',
          });
        }
        req.authorizedData = authorizedData;
        return next();
      }
    );
  }
}

export default TokenGenerator;
