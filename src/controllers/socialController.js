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
 *@description - class
  * @param {object} req
  * @param {object} res
  * @returns {object} response
  */
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
        lastname = displayName.split(' ')[0];
      } else {
        firstname = userData.name.familyName;
        lastname = userData.name.givenName;
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
