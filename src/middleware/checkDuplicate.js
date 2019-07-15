import { User } from '../db/models';

/**
 * @description checks for duplicate request parameters
 * @class CheckDuplicate
 */
class CheckDuplicate {
  /**
   * @description Checks whether input username and email exists in database
   * @static
   * @async
   * @param {object} req - signup request object
   * @param {object} res - signup response object
   * @param {function} next - next function
   * @returns {object} checkExistingUser
   * @memberof CheckDuplicate
   */
  static async checkExistingUser(req, res, next) {
    const { userName, email } = req.body;
    let existingEmail = [];
    let existingUsername = [];

    try {
      existingUsername = await User.findAll({
        where: {
          userName
        }
      });

      existingEmail = await User.findAll({
        where: {
          email
        }
      });

      if (existingEmail.length > 0 && existingUsername.length > 0) {
        const errorMsg = {
          username: [
            'Username already exists.'
          ],
          email: [
            'Email already exists.'
          ],
        };

        return res.status(401).json({
          message: 'Invalid request',
          errors: errorMsg,
        });
      }

      if (existingEmail.length > 0) {
        const errorMsg = {
          email: [
            'Email already exists.'
          ],
        };

        return res.status(401).json({
          message: 'Invalid request',
          errors: errorMsg,
        });
      }

      if (existingUsername.length > 0) {
        const errorMsg = {
          username: [
            'Username already exists.'
          ],
        };

        return res.status(401).json({
          message: 'Invalid request',
          errors: errorMsg,
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
        errors: error,
      });
    }
  }
}

export default CheckDuplicate;
