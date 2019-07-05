import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import dotenv from 'dotenv';

dotenv.config();
=======
import { GENERATE_SECRET } from '../db/config/config';
>>>>>>> feature(user password reset):user password reset

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
<<<<<<< HEAD
    jwt.sign(payload,
      process.env.GENERATE_SECRET, {
=======
    jwt.sign(
      payload,
      GENERATE_SECRET, {
>>>>>>> feature(user password reset):user password reset
        expiresIn: '1h'
      },
      async (err, token) => {
        req.generate = token;
        return next();
<<<<<<< HEAD
      });
=======
      }
    );
>>>>>>> feature(user password reset):user password reset
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
<<<<<<< HEAD
    jwt.verify(req.query.resetToken,
      process.env.GENERATE_SECRET,
=======
    jwt.verify(
      req.query.resetToken,
      GENERATE_SECRET,
>>>>>>> feature(user password reset):user password reset
      (err, authorizedData) => {
        if (err) {
          return res.status(400).json({
            status: 400,
            message: 'token has expired',
          });
        }
        req.authorizedData = authorizedData;
        return next();
<<<<<<< HEAD
      });
=======
      }
    );
>>>>>>> feature(user password reset):user password reset
  }
}

export default TokenGenerator;
