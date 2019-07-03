import auth from '../middleware/Auth';
import { Blacklist, User } from '../db/models';

/**
 * @description This class handles user requests
 * @class UserController
 */
class UserController {
  /**
 *
 *
 * @static
 * @param {object} request
 * @param {object} response
 * @returns {object} response
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
  * @returns {object} response
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

  /**
     *
     * @param {object} req the request body
     * @param {object} res the response body
     * @returns {object} res
     * @memberof UserController
     */
  static async updateProfile(req, res) {
    try {
      const {
        firstname, lastname, username, bio,
      } = req.body;

      const userId = req.user.id;

      const userData = await User.findOne({
        where: {
          userId
        }
      });

      let firstnameValue;
      let lastnameValue;
      let bioValue;
      let usernameValue;

      if (!firstname) firstnameValue = userData.firstname;
      else firstnameValue = firstname;
      if (!lastname) lastnameValue = userData.lastname;
      else lastnameValue = lastname;
      if (!bio) bioValue = userData.bio;
      else bioValue = bio;
      if (!username) usernameValue = userData.username;
      else usernameValue = username;

      await userData.update({
        firstname: firstnameValue,
        lastname: lastnameValue,
        username: usernameValue,
        bio: bioValue,
      }, {
        where: {
          firstname: firstnameValue,
          lastname: lastnameValue,
          username: usernameValue,
          bio: bioValue,
        }
      });

      return res.status(200).json({
        firstname: firstnameValue,
        lastname: lastnameValue,
        username: usernameValue,
        bio: bioValue,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error,
      });
    }
  }
}

export default UserController;
