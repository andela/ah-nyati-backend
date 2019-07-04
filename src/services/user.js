import { User, Follow } from '../db/models';

/**
 * User Services
 * @constructor
 */
class UserServices {
  /**
   * User Follow
   * @constructor
   * @param {*} token - generate token
   * @param {*} userId - follow id
   */
  static async followUser(token, userId) {
    try {
      let statusCode = '',
        errorMessage = '',
        successMessage = '';
      const errors = {};

      const findUser = await User.findOne({
        where: {
          id: userId
        }
      });

      if (findUser !== null) {
        const findFollow = await Follow.findOne({
          where: {
            followId: userId
          }
        });

        // CHECK IF USER IS TRYING TO FOLLOW THEMSELVES
        if (token.id !== Number(userId)) {
          // IF USER IS NOT ALREADY FOLLOWING
          if (findFollow === null) {
            await Follow.create({
              userId: token.id,
              followId: userId
            });

            // RETURN SUCCESS IF SUCCESS
            statusCode = 200;
            successMessage = 'you just followed this user';
            return {
              statusCode,
              errorMessage,
              successMessage
            };
          }

          // RETURN ERROR IF USER IS ALREADY FOLLOWING THE USER
          errors.follow = 'you are already following this user';
          statusCode = 400;
          errorMessage = errors;
          return {
            statusCode,
            errorMessage,
            successMessage
          };
        }

        // RETURN ERROR IF USER IS TRYING TO FOLLOW THEMSELVES
        errors.follow = 'you can not follow yourself';
        statusCode = 400;
        errorMessage = errors;
        return {
          statusCode,
          errorMessage,
          successMessage
        };
      }

      // RETURN ERROR IF THE USER DOES NOT EXIST
      errors.user = 'user does not exist';
      statusCode = 404;
      errorMessage = errors;
      return {
        statusCode,
        errorMessage,
        successMessage
      };
    } catch (err) {
      return err;
    }
  }

  /**
   * Un Follow User
   * @constructor
   * @param {*} token - generate token
   * @param {*} userId - follow id
   */
  static async unFollowUser(token, userId) {
    try {
      let statusCode = '',
        errorMessage = '',
        successMessage = '';
      const errors = {};

      const findUser = await User.findOne({
        where: {
          id: userId
        }
      });

      if (findUser !== null) {
        const findFollow = await Follow.findOne({
          where: {
            followId: userId
          }
        });

        // IF USER IS NOT ALREADY FOLLOWING
        if (findFollow !== null) {
          await Follow.destroy({
            where: {
              userId: token.id,
              followId: userId
            }
          });

          // RETURN SUCCESS IF SUCCESS
          statusCode = 200;
          successMessage = 'you just unfollowed this user';
          return {
            statusCode,
            errorMessage,
            successMessage
          };
        }

        // RETURN ERROR IF USER IS NOT FOLLOWING THE USER
        errors.follow = 'you are not following this user';
        statusCode = 400;
        errorMessage = errors;
        return {
          statusCode,
          errorMessage,
          successMessage
        };
      }

      // RETURN ERROR IF THE USER DOES NOT EXIST
      errors.user = 'user does not exist';
      statusCode = 404;
      errorMessage = errors;
      return {
        statusCode,
        errorMessage,
        successMessage
      };
    } catch (err) {
      return err;
    }
  }
}

export default UserServices;
