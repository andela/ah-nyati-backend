import { User, Follow } from '../db/models';
import findItem  from '../helpers/findItem';
/**
 * @description This class handles user requests
 * @class UserController
 */
class UserController {
  /**
   * @static
   * @description this function gets all registered users
   * @param {object} req the request body
   * @param {object} res the response body
   * @returns {object} res
   * @memberof UserController
   */
  static async getUserProfile(req, res) {
    const { userName } = req.params;

    try {
      const userData = await User.findOne({
        attributes: ['firstName', 'lastName', 'userName',
          'email', 'bio', 'imageUrl'],
        where: { userName },
      });

      if (!userData) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Operation successful',
        data: [ userData ],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }

  /**
     *@static
     *@description this function creates and updates user profile
     * @param {object} req the request body
     * @param {object} res the response body
     * @returns {object} res
     * @memberof UserController
     */
  static async updateProfile(req, res) {
    try {
      const {
        firstName, lastName, userName, bio,
      } = req.body;

      const avatar = req.file;
      const userId = req.user;
      let { id } = req.params;
      id = Number(id);

      let avatarValue;

      if (avatar) avatarValue = avatar.url;

      const userDetails = {
        firstName,
        lastName,
        userName,
        bio,
        imageUrl: avatarValue,
      };

      const where = {
        id,
      };

      const attributes = ['id', 'firstName', 'lastName', 'userName', 'bio', 'imageUrl'];

      const userData = await User.findOne({ attributes, where });

      if (id === userId) {
        await userData.update(userDetails, { where });

        return res.status(200).json({
          status: 200,
          message: 'Profile updated successfully',
          data: [userDetails],
        });
      }
      return res.status(401).json({
        status: 401,
        message: 'You do not have permission to perform that operation',
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).json({
          status: 400,
          message: 'User with that username already exists',
        });
      }
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  /**
 *
 *@description Follow and Unfollow User
 * @static
 * @param {object} req
 * @param {object} res
 * @returns {object} res
 * @memberof UserController
 */
  static async followSystem(req, res) {
    try {
      const user = req.userResponse;

      const loggedInUserID = req.user;
      const checkIfFollowing = await Follow.findOne({
        where: {
          follower: loggedInUserID,
          followee: user.id
        }
      });

      // FOLLOW IF USER IS NOT FOLLOWING
      if (!checkIfFollowing) {
        await Follow.create({
          follower: loggedInUserID,
          followee: user.id
        });
        return res.status(200).json({
          status: 200,
          message: `You just followed ${user.userName}`,
        });
      }

      // UNFOLLOW IF USER IS ALREADY FOLLOWING
      await Follow.destroy({
        where: {
          follower: loggedInUserID,
          followee: user.id
        }
      });
      return res.status(200).json({
        status: 200,
        message: `You just unfollowed ${user.userName}`,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  /**
   * @static
   * @description this function gets all users(authors) with atleast one article in the article table
   * @param {object} req the request body
   * @param {object} res the response body
   * @returns {object} res
   * @memberof UserController
   */
  static async getAllAuthorsProfile(req, res) {
    try {

    const authors = await findItem.getAllAuthorsProfile();
    
    return res.status(200).json({
      status: 200,
      message: 'Retrieved Successfully',
      data: authors
    });

    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }
}

export default UserController;
