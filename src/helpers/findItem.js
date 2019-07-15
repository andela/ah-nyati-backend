import { Article, User } from '../db/models';
/**
*
*@description This class checks a table for the presence or absence of a row
* @class FindItem
*/
class FindItem{
    /**
     *@description This function checks if an article exists
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {function} next
     * @memberof FindItem
     */
    static async findArticle  (req, res, next) {
      const { slug } = req.params;
      try {
      const article = await Article.findOne({
        where: { slug },
        raw: true,
        attributes: {
          exclude: ['updatedAt', 'userId', 'catId', 'isDraft']
        }
      });

      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Article not found',
        });
      }
      res.locals.article = article
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
    }

    /**
   * @static
   * @description Method to fetch an article with the user
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} object
   */
static async getArticle (req, res, next) {
    const article = await Article.findOne({
      include: [{
        model: User,
        attributes: [
          'id',
          'bio',
          'userName',
          'imageUrl'
        ]
      }],
      attributes: ['id', 'body', 'createdAt', 'updatedAt'],
      where: {
        slug: req.params.slug
      }
    });
  
    if (!article) {
      return res.status(404)
        .json({
          status: 404,
          message: 'Article not found'
        });
    }
    res.locals.articleObject = article;
    next();
  };

  /**
   *@description This function checks if a user exists
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async findUser(req, res, next) {
    const { userId } = req.params;

    const findUser = await User.findOne({
      where: {
        id: userId
      }
    });

    if (!findUser) {
      // RETURN ERROR IF THE USER DOES NOT EXIST
      const errors = {};
      errors.user = 'user does not exist';
      return res.status(404).json({
        status: 404,
        data: errors,
      });
    }
    req.userResponse = findUser;
    return next();
  }

  /**
   *@description This function checks if a user is trying to follow themselves
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async checkIfFollowingSelf(req, res, next) {
    const userToken = req.user;
    const { userId } = req.params;

    if (userToken === Number(userId)) {
      // RETURN ERROR IF USER IS TRYING TO FOLLOW THEMSELVES
      const errors = {};
      errors.follow = 'you can not follow yourself';
      return res.status(400).json({
        status: 400,
        data: errors,
      });
    }
    return next();
  }

  /**
   *@description This function checks if a user exists by email
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async findUserByEmail(req, res, next) {
    const { email } = req.body;

    const findUserByEmail = await User.findOne({
      where: {
        email
      }
    });

    if (!findUserByEmail) {
      // SET ERROR IF EMAIL DOES NOT EXIST
      const errors = {};
      errors.email = 'email does not exist';
      return res.status(404).json({
        status: 404,
        message: errors,
      });
    }
    req.userByEmail = findUserByEmail;
    return next();
  }
}

   export default FindItem;
