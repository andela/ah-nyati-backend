import jwt from 'jsonwebtoken';
import { GENERATE_SECRET } from '../db/config/config';

/**
 *
 *
 * @class TokenGenerator
 */
class TokenGenerator {
  /**
   *
   * @constructor
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof TokenGenerator
   */
  static tokenGenerate(req, res, next) {
    const payload = {
      token: 'token'
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
   * @constructor
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof TokenGenerator
   */
  static verifyToken(req, res, next) {
    jwt.verify(
      req.query.resetToken,
      GENERATE_SECRET,
      (err, authorizedData) => {
        if (err) {
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
