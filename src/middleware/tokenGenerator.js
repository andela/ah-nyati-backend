import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
   *
   * @constructor
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof TokenGenerator
   */
  static verifyToken(req, res, next) {
    jwt.verify(req.query.resetToken,
      process.env.GENERATE_SECRET,
      (err, authorizedData) => {
        if (err) {
          return res.status(400).json({
            status: 400,
            message: 'token has expired',
          });
        }
        req.authorizedData = authorizedData;
        return next();
      });
  }
}

export default TokenGenerator;
