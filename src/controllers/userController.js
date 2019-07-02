import auth from '../middleware/Auth';
import { Blacklist, User } from '../db/models';

/**
 *
 *
 * @class UserController
 */
class UserController {
/**
 *
 *
 * @static
 * @param {object} request
 * @param {object} response
 * @returns
 * @memberof UserController
 */
static async login(request, response) {
    const { email } = request.body;
    try {
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['password'] }
      });
      const { id } = user;
      const userToken = auth.authenticate(id);
      if (user) {
        return response.status(200).json({
          status: 200,
          message: 'User successfully Logged In',
          data: userToken
        });
      }
      return response.status(404).json({
        status: 404,
        message: 'User Not Found',
      });
    } catch (error) {
      return response.status(500).json({
        status: 500,
        message: error,
      });
    }
  }


  /**
  *
  *@description Logout a user
  * @static
  * @param {object} request
  * @param {object} response
  * @returns {object}
  * @memberof UserController
  */
  static async logOut(request, response) {
    const { token } = request.headers || request.body || request.query;
    try {
      const createdToken = await Blacklist.create({
        token
      });
      return response.status(201).json({
        status: 201,
        message: 'User successfully Logged Out',
        data: createdToken
      });
    } catch (error) {
      return response.status(500).json({
        status: 500,
        data: error,
      });
    }
  }
}

export default UserController;
