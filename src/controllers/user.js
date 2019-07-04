import UserServices from '../services/user';
import statusCheckerHelper from '../helpers/statusChecker';

const {
  statusChecker
} = statusCheckerHelper;

const {
  followUser,
  unFollowUser
} = UserServices;

/**
 * User Controller
 * @constructor
 */
class UserController {
  /**
   * User Follow
   * @constructor
   * @param {*} req - req
   * @param {*} res - res
   */
  static async followUser(req, res) {
    try {
      const {
        userId
      } = req.params;
      const {
        statusCode,
        errorMessage,
        successMessage
      } = await followUser(req.authorizedData, userId);

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
   * Un Follow User
   * @constructor
   * @param {*} req - req
   * @param {*} res - res
   */
  static async unFollowUser(req, res) {
    try {
      const {
        userId
      } = req.params;
      const {
        statusCode,
        errorMessage,
        successMessage
      } = await unFollowUser(req.authorizedData, userId);

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

export default UserController;
