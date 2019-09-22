import { Article, User, Follow, Comment, Category, notification, Like } from '../db/models';
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
  static async findArticle(req, res, next) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({
        where: { slug },
        attributes: {
          exclude: ['updatedAt', 'catId', 'isDraft'],
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
   *@description This function returns user details
   * @param {string} userId
   * @returns {function} user
   * @memberof FindItem
   */
  static async getUser(userId) {
    const findUser = await User.findOne({
      where: {
        id: userId
      },
      attributes: ['firstName', 'lastName', 'userName', 'email', 'emailNotification']
    });
    return findUser;
  }

  /**
   *@description This function returns user followers
   * @param {string} userId
   * @returns {function} user followers
   * @memberof FindItem
   */
  static async getUserFollowers(userId) {
    const userFollowers = await Follow.findAll({
      where: {
        followee: userId
      },
      attributes: ['follower', 'recieveNotification'],
      include: [
        {
          model: User,
          as: 'followers',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    return userFollowers;
  }

  /**
   *@description This function checks if a user has notification
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async getAllAuthorsProfile(req, res) {
    let offset = 0;
    
    const { currentPage, limit } = req.query;
    const defaultLimit = limit || 3;

    offset = currentPage ? defaultLimit * (currentPage - 1) : 0;

    const {count, rows: authors} = await Article.findAndCountAll({
      offset,
      limit: defaultLimit,
      attributes: ['views', 'read', 'readRatio'],
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'userName',
          'email', 'bio', 'imageUrl'],
        },
       
      ]
      
    });
    
    const pages = Math.ceil(count / limit) || 1;
    
    if (authors.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No authors found',
      });
    }
    
    const profile = {};
      
    
    profile.authors = authors;
    profile.pages = pages;
    profile.count = count;
    profile.limit = limit || 10;
    profile.currentPage = currentPage || 1;
    
    return profile;
    
  }

  /**
   *@description this function gets a user's( an author) reading stat
   * @param {object} user
   * @returns {object} object
   * @memberof FindItem
   */
  static async getUserReadStat(user) {
    const result = await Article.findAll({
      where: { userId: user },
      attributes: {
        exclude: ['id', 'body', 'description', 'updatedAt', 'imageUrl', 'isDraft', 'createdAt', 'userId', 'catId']
      }
    })
     
    const stat = {};
      
    result.forEach((article) => {
      const articleStat = ({...(article.toJSON())});
      stat[article.slug] = articleStat;
    })

    return (Object.values(stat))
  }

  /**
   *@description This method checks if there is articles in the table
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async findAllArticles(req, res, next) {
    const findAllArticles = await Article.findAll({});

    if (findAllArticles.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'no article found'
      });
    }
    return next();
  }

  /** 
   *@description This function get user notifications
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindItem
   */
  static async getUserNotification(req, res, next) {
    const userId = req.user;

    const userNotification = await notification.findAll({
      where: {
        userId
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    });

    if (userNotification.length === 0) {
      // RETURN ERROR IF THE USER DOES NOT HAVE NOTIFICATION
      return res.status(404).json({
        status: 404,
        message: 'No notification',
      });
    }
    req.userNotification = userNotification;
    return next();
  }

  /** 
   *@description This function counts rows in table
   * @param {object} model
   * @param {object} articleId
   * @returns {function} next
   * @memberof FindItem
   */
  static async findAndCount(model, articleId) {
    if (model === 'Comment') {
      const { count } = await Comment.findAndCountAll({
        where: {
          articleId
        },
        limit: 1,
        attributes: ['id'],
      });
      return count;
    }

    const { count, rows: likers } = await Like.findAndCountAll({
      where: {
        articleId
      },
      attributes: ['userId'],
    });
    return {
      count,
      likers,
    };
  }
}

export default FindItem;
