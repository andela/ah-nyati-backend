import passwordHash from 'password-hash';
import { Blacklist, User } from '../db/models';
import Auth from '../helpers/helpers';
import sendEmail from '../helpers/mail/mailer';

const {
  generateToken
} = Auth;
/**
 *
 *
 * @class UserController
 */
class UserController {
  // eslint-disable-next-line valid-jsdoc
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   * @memberof UserController
   */
  static async createAccount(req, res) {
    try {
      const {
        firstname, lastname, username, email, password
      } = req.body;
      const isVerified = false;
      const hashedpassword = passwordHash.generate(password);
      const values = {
        firstname, lastname, username, email, password: hashedpassword, isVerified
      };
      const user = await User.create(values);
      const { id } = user;
      const token = await generateToken({ id, username, email });

      const html = `
            <div>
            Hey there,
            <br />
            <br />
            Here is signup verification code:
            <br />
            <br />
            ${token}
            <br />
            <br />
            <h6>Thank You</h6>
            </div>
            `;
      await sendEmail
        .sendEmail('do_not_reply@authorhaven.com',
          email, 'User Account Registration', html);

      return res.status(201).json({
        status: 201,
        message: 'User signup successful',
        data: [{ token, user }],
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  // eslint-disable-next-line valid-jsdoc
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
        message: 'Internal server error',
      });
    }
  }
}

export default UserController;
