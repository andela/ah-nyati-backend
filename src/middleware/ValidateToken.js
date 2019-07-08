import { Blacklist } from '../db/models';
/**
 *
 *
 * @class ValidateToken
 */
class ValidateToken {
/**
  *
  *@description Checks if the token exist and if it already exist in the blacklist table
  * @static
  * @param {string} req
  * @param {object} res
  * @param {function} next
  * @returns {object} It returns the error message
  * @memberof ValidateToken
  */
  static async checkToken(req, res, next) {
    const { token } = req.headers || req.body || req.query;
    if (!token) {
      return res.status(400).json({
        status: 400,
        error: 'Token is required',
      });
    }
    const result = await Blacklist.findOne({ where: { token } });
    if (result) {
      return res.status(409).json({
        status: 409,
        message: 'User already Logged Out',
      });
    }

    next();
  }
}

export default ValidateToken;
