/* eslint-disable prefer-destructuring */
import { User } from '../db/models';
import { generateToken, hashPassword } from '../helpers/helpers';


/**
 * @class social Login Controller
 */

// eslint-disable-next-line require-jsdoc
export default class socialController {
  // eslint-disable-next-line require-jsdoc
  static async socialUser(req, res) {
    try {
      const userData = req.authInfo;
      if (userData.emails === undefined) {
        return res.status(400).send('Email not found');
      }
      const newPassword = Math.random().toString(36).slice(-10);
      const password = hashPassword(newPassword);

      let firstname, lastname;
      const { displayName } = userData;

      if (displayName) {
        firstname = displayName.split(' ')[0];
        lastname = displayName.split(' ')[1];
      } else {
        firstname = userData.name.familyName;
        lastname = userData.name.givenName;
      }

      if (!firstname || !lastname) {
        return res.status(400).send('Firstname or Lastname not found');
      }

      const user = await User.findOrCreate({
        where: { email: userData.emails[0].value },
        defaults: {
          firstname,
          lastname,
          password,
          email: userData.emails[0].value,
          image_url: userData.photos[0].value,
          social: userData.provider
        }
      });
      if (!user) {
        return res.status(404).send('user not found');
      }

      const {
        id,
        firstname: firstName,
        lastname: lastName,
        email,
        bio,
        image_url: image,
      } = user[0].dataValues;

      const token = generateToken({
        id,
        firstName,
        lastName,
        email,
        bio,
        image_url: image,
      }, '1d');

      return res.status(200).json({
        message: 'successful',
        token
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  }
}
