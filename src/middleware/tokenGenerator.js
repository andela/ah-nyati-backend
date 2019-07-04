import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import statusChecker from '../helpers/statusChecker';

dotenv.config();

/**
 * Auth Services
 * @constructor
 */
class TokenGenerator {
  /**
   * Generate reset token
   * @constructor
   * @param {*} req - request
   * @param {*} res - response
   * @param {*} next - run next
   */
  static tokenGenerate(req, res, next) {
    const payload = {
      token: 'token',
      id: 2
    };
    jwt.sign(payload,
      process.env.GENERATE_SECRET, {
        expiresIn: '1h'
      },
      async (err, token) => {
        req.generate = token;
        return next();
      });
  }

  /**
   * Verify secret Token
   * @constructor
   * @param {*} req - request
   * @param {*} res - response
   * @param {*} next - run next
   */
  static verifyToken(req, res, next) {
    jwt.verify(req.query.resetToken,
      process.env.GENERATE_SECRET,
      (err, authorizedData) => {
        if (err) {
          return statusChecker
            .statusChecker(req,
              res,
              400,
              'token has expired',
              '');
        }
        req.authorizedData = authorizedData;
        return next();
      });
  }
}

export default TokenGenerator;
