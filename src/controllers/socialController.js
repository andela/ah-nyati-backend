import { User } from '../db/models';
import { generateToken, hashPassword } from '../helpers/helpers';

/**
 *@description - class
  * @param {object} req
  * @param {object} res
  * @returns {object} response
  */
export default class socialController {
  /**
  * @description - Social Login/Signup
  * @static
  * @param {object} req
  * @param {object} res
  * @returns {object} response
  * @memberof socialController
  */
  static async socialUser(req, res) {
    try {
      const userData = req.authInfo;
      if (userData.emails === undefined) {
        return res.status(400).send('Email not found');
      }
      const newPassword = Math.random().toString(36).slice(-10);
      const password = hashPassword(newPassword);


      let firstName, lastName, lName;
      const { displayName } = userData;
      if (displayName) {
        [firstName, lName] = displayName.split(' ');
        lastName = lName === undefined ? '' : lName;
      } else {
        firstName = userData.name.familyName;
        lastName = userData.name.givenName;
      }

      const user = await User.findOrCreate({
        where: { email: userData.emails[0].value },
        defaults: {
          firstName,
          lastName,
          userName: userData.emails[0].value,
          password,
          isVerified: true,
          bio: '',
          verificationToken: '',
          email: userData.emails[0].value,
          imageUrl: userData.photos[0].value,
          social: userData.provider
        }
      });

      if (!user) {
        return res.status(404).send('user not found');
      }

      const {
        id,
        firstName: firstname,
        lastName: lastname,
        email,
        bio,
        image_url: image,
      } = user[0].dataValues;

      const token = generateToken({
        id,
        email
      }, '24h');

      return res.status(200).json({
        message: 'successful',
        data: {
          token,
          firstname,
          lastname,
          bio,
          image
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  }
}
