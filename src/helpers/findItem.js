import { Article, User, Comment, Category } from '../db/models';
/**
 *
 *@description This class checks a table for the presence or absence of a row
 * @class FindItem
 */
class FindItem {
  /**
   *@description This function checks if an article exists
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async findArticle(req, res, next) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({
        where: { slug },
        raw: true,
        attributes: {
          exclude: ['updatedAt', 'userId', 'catId', 'isDraft'],
        },
      });

      if (!article) {
        return res.status(404).json({
          status: 404,
          message: 'Article not found',
        });
      }
      res.locals.article = article;
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

    /**
     *@description This function finds an article using id
     * @param {integer} id - the id of the article to be found
     * @returns {object} article
     * @memberof FindItem
     */
    static async findArticleById(id) {
      const article = await Article.findOne({
        where: {
          id
        }
      });
      return article;
    }

    /**
     *@description This function finds a comment using id
     * @param {integer} id - the id of the comment to find
     * @returns {object} comment
     * @memberof FindItem
     */
    static async findCommentById(id) {
      const comment = await Comment.findOne({
        where: {
          id
        }
      });
      return comment;
    }

    /**
   * @static
   * @description Method to fetch an article with the user
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} object
   */
  static async getArticleWithAuthor(req, res, next) {
    const article = await Article.findOne({
      include: [
        {
          model: User,
          attributes: ['id', 'bio', 'userName', 'imageUrl'],
        },
      ],
      attributes: ['id', 'body', 'createdAt', 'updatedAt'],
      where: {
        slug: req.params.slug,
      },
    });

    if (!article) {
      return res.status(404).json({
        status: 404,
        message: 'Article not found',
      });
    }
    res.locals.articleObject = article;
    next();
  }

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
        id: userId,
      },
    });

    if (!findUser) {
      // RETURN ERROR IF THE USER DOES NOT EXIST
      return res.status(404).json({
        status: 404,
        message: 'User does not exist',
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
      return res.status(400).json({
        status: 400,
        message: 'You cannot follow yourself',
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
        email,
      },
    });

    if (!findUserByEmail) {
      // SET ERROR IF EMAIL DOES NOT EXIST
      return res.status(404).json({
        status: 404,
        message: 'Email does not exist',
      });
    }
    req.userByEmail = findUserByEmail;
    return next();
  }

/**
   *@description This function checks if a comment exists
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async findComment(req, res, next) {
    const { id } = req.params;
      const comment = await Comment.findOne({
        where: { id },
        attributes: ['id', 'commentBody', 'createdAt', 'updatedAt', 'articleId'],     
      });

      if (!comment) {
        return res.status(404).json({
          status: 404,
          message: 'Comment not found',
        });
      }
      res.locals.comment = comment;
      return next();
  }
  
    /**
     *@description This function finds a category using id
     * @param {integer} id - the id of the article to be found
     * @returns {object} category
     * @memberof FindItem
     */
    static async findCategoryById(id) {
      const category = await Category.findOne({
        where: {
          id
        }
      });
      return category;
    }

  /**
   *@description This method fetches all authors in the article table
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async getAllAuthorsProfile(req, res) {
    const authors = await Article.findAll({
      attributes: ['views', 'read', 'readRatio'],
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'userName',
          'email', 'bio', 'imageUrl'],
        },
       
      ]
      
    })
    
    if (authors.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No authors found',
      });
    }
    const profile = {};
      
    authors.forEach((userProfile) => {
    const user = {...(userProfile.toJSON()).User};
    profile[user.email] = user;
    });

    return (Object.values(profile))
  }


}

export default FindItem;
