import auth from '../middleware/Auth';
import { Blacklist, User } from '../db/models';
/**
 *
 *
 * @class AuthController
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
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['password'] }
      });
      const userToken = auth.authenticate(user);
      if (user) {
        return res.status(200).json({
          status: 200,
          message: 'User successfully Logged In',
          data: userToken
        });
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
    const { token } = req.headers || req.body || req.query;
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
}

export default AuthController;
