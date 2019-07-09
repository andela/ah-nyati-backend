import auth from '../middleware/Auth';
import { Blacklist, User } from '../db/models';
/**
 * @class AuthController
 */
class AuthController {
/**
 * @static
 *@description logs in autheticated user
 * @param {object} req the request body
 * @param {object} res the response body
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

      if (!user) {
        return res.status(404).json({
          status: 400,
          error: 'User not found',
        });
      }
      const { id } = user;
      const userToken = auth.authenticate(id);
      if (user) {
        return res.status(200).json({
          status: 200,
          message: 'User successfully Logged In',
          data: userToken
        });
      }
      return res.status(404).json({
        status: 404,
        message: 'User Not Found',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  /**
  *@static
  *@description Logout a user
  * @param {object} req the request body
  * @param {object} res the response body
  * @returns {object} res
  * @memberof AuthController
  */
  static async logOut(req, res) {
    const { token } = req.headers || req.body || req.query;
    try {
      await Blacklist.create({
        token
      });
      return res.status(200).json({
        status: 200,
        message: 'User successfully Logged Out',
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
