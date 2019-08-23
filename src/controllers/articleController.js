import { Article, Tag, User, Category, highlightComment } from '../db/models';
import slugGen from '../helpers/slugGen';
import urlExtractor from '../helpers/urlExtractor';
import tagExtractor from '../helpers/tagExtractor';
import searchHelper, { searchOutcome } from '../helpers/searchHelper';
import notification from '../helpers/notification';
import findItem from '../helpers/findItem';

/**
 * @description Article Controller
 * @class ArticleController
 */
class ArticleController {
  /**
 *
 *@description search for an article
 * @static
 * @param {object} req the request body
 * @param {object} res the response body
 * @returns {object} filtered article object
 * @memberof ArticleController
 */
  static async search(req, res) {
    const {
      author, title: Title, category, tag: tagName, q
    } = req.query;

    try {
      if (author) {
        const result = await searchHelper.searchByAuthor(author);
        const articlesCount = result.length;

        if (!result || result.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'The author you selected has no article(s) at the moment, please check your input'
          });
        }

        searchOutcome(result, res, articlesCount);
      } else if (Title) {
        const result = await searchHelper.searchByTitle(Title);
        const articlesCount = result.length;

        if (!result || result.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'The title you selected does not exist'
          });
        }

        searchOutcome(result, res, articlesCount);
      } else if (category) {
        const result = await searchHelper.searchByCategory(category);
        const articlesCount = result.length;

        if (!result || result.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'The category you selected does not exist'
          });
        }

        searchOutcome(result, res, articlesCount);
      } else if (tagName) {
        const result = await searchHelper.searchByTag(tagName);
        const articlesCount = result.length;

        if (!result || result.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'The tag you selected does not exist'
          });
        }

        searchOutcome(result, res, articlesCount);
      } else if (q) {
        const result = await searchHelper.searchByUserInput(q);
        const articlesCount = result.length;
        if (!result || result.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'Your search does not exist'
          });
        }

        searchOutcome(result, res, articlesCount);
      } else {
        const result = await Article.findAll({
          include: [{
            model: User,
            attributes: {
              exclude: ['id', 'password', 'isVerified', 'verificationToken', 'createdAt', 'updatedAt']
            }
          }],
          limit: 5
        });
        const articlesCount = result.length;
        if (!result || result.length === 0) {
          return res.status(404).json({
            status: 404,
            error: 'There are no articles at the moment'
          });
        }
        searchOutcome(result, res, articlesCount);
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }

  /**
   * @description - Creates a new article
   * @static
   * @async
   * @param {object} req - create artilce request object
   * @param {object} res - create artilce response object
   * @returns {object} new article
   *
   */
  static async createArticle(req, res) {
    try {
      const {
        title, description, body, catId, tagList, isDraft
      } = req.body;

      const userId = req.user;
      const images = req.files;
      const imageUrl = urlExtractor(images);
      const slug = slugGen(title);

      const newArticleDetails = {
        title, slug, description, body, catId, imageUrl, userId, isDraft
      };

      const newArticle = await Article.create(newArticleDetails);

      const { id } = newArticle;
      const newTagDetails = tagExtractor(id, tagList);

      await Tag.bulkCreate(newTagDetails);

      

      // SEND ARTICLE TO USER FOLLOWERS
      const loggedInUser = await findItem.getUser(userId);
      const userFollowers = await findItem.getUserFollowers(userId);
      userFollowers
        .map(user => {
          // CHECK IF USER OPT IN TO RECIEVE NOTIFICATION FROM USER
          if (user.recieveNotification) {
            notification(user.follower, `${loggedInUser.firstName} ${loggedInUser.lastName} created a new article ${title}`)
          }
        });

      return res.status(201).json({
        status: 201,
        message: 'Article successfully created',
        data: [ newArticle ]
      });
    } catch (error) {
      return res.status(500).json({ 
        status: 500,
        message: error.message
      });
    }
  }

  /**
   * @description - Get a single article with readtime
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} article
   *
   */
  static async getArticle(req, res) {
    try {
      const { slug } = req.params;

      const getArticle = await Article.findOne({
        where: {
          slug
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [
          {
            model: Category,
            attributes: ['id', 'name']
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'userName', 'bio', 'imageUrl']
          }
        ]
      });

      const { body, views, read  } = getArticle.dataValues;

      const wordCount = body.split(' ').filter(word => word !== ' ');
     
      const readTime = Math.round((wordCount.length / 200) + 1);

      const getTags = await Tag.findAll({
        where: {
          articleId: getArticle.id
        }
      })

      const allTags = [];
      getTags.map(tag => allTags.push(tag.tagName))

      const article = {};
      article.article = getArticle;
      article.tag = allTags;
      article.readTime = readTime;

      const timeOfPageLoad = 4;
      const timeOfPageUnload = 10;
      const actualReadTime = timeOfPageUnload - timeOfPageLoad;

      if(getArticle) {
        let view = views;
        let reads = read

        getArticle.update({
          views: view += 1
        })
        if(actualReadTime > readTime){
          getArticle.update({
            read: reads += 1
          })
        }
      }

      return res.status(200).json({
        status: 200,
        message: `This article's read time is ${readTime} mins`,
        data: [article]
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }

  /**
   * @description - Highlight and Comment an article
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} highlighted comment
   */
  static async highlightAndComment(req, res) {
    try {
      const { highlightedWord, comment } = req.body;
      const userId = req.user;
      const article = res.locals.articleObject;
      const articleId = article.id

      const isHighlightedWordFound = article.body.includes(highlightedWord)
      if (isHighlightedWordFound) {
        await highlightComment.create({
          highlightedWord,
          comment,
          userId,
          articleId
        })

        return res.status(201).json({
          status: 201,
          message: `${highlightedWord} has been highlighted`
        });
      }

      return res.status(400).json({
        status: 400,
        message: 'invalid highlighted word'
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  /**
   * @description - Get all article
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} article
   *
   */
  static async getAllArticles(req, res) {
    try {
      let offset = 0;
      const { findAndCount } = findItem;
      
      const { currentPage, limit } = req.query; // page number
      const defaultLimit = limit || 3; // number of records per page

      offset = currentPage ? defaultLimit * (currentPage - 1) : 0;

      const { count, rows: articles } = await Article.findAndCountAll({
        offset,
        limit: defaultLimit,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [
          ['id', 'ASC'],
        ],
        include: [
          {
            model: Category,
            attributes: ['id', 'name']
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'userName', 'bio', 'imageUrl']
          }
        ]
      });

      const pages = Math.ceil(count / limit) || 1;
      const allArticles = await Promise.all(articles.map(async (article) => {
        const comment = await findAndCount('Comment', article.id);
        const like = await findAndCount('Like', article.id);
        return {
          article,
          comments: comment,
          likes: like,
        };
      }));

      return res.status(200).json({
        status: 200,
        message: 'All articles fetched successfully',
        data: [ 
          {
            allArticles,
            totalArticles: count,
            currentPage,
            limit,
            totalPages: pages
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }

/**
   * @description - Users update their article
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} article
   *
   */
static async updateArticle(req, res) {
  try {
    const { slug } = req.params;
    const userId = req.user;

    
    const getArticle = await Article.findOne({
      where: {
        slug
      },
      attributes: {
        include: ['userId']
      },
    });

    if (userId !== getArticle.userId) {
      return res.status(403).json({
        status: 403,
        message: 'You don\'t have the permission to carry out this operation',
      });
    }

    const {
      title, description, body, catId, tagList, isDraft
    } = req.body;

    const images = req.files;
      const imageUrl = urlExtractor(images);

      const editedArticle = {
        title,
        description: description || getArticle.description,
        body,
        catId,
        imageUrl: imageUrl || getArticle.imageUrl,
        tagList: tagList || getArticle.tagList, 
        isDraft: isDraft || getArticle.isDraft,
      };

      const result = await Article.update(editedArticle,
        { where: {
          slug,
        },
        returning: true
      });
      const { id } = getArticle;
      const newTagDetails = tagExtractor(id, tagList);
      const updatedArticle = result[1][0];
      await Tag.bulkCreate(newTagDetails);

      return res.status(200).json({
        status: 200,
        message: 'Article successfully updated',
        data: {
          id: updatedArticle.id,
          title: updatedArticle.title,
          slug: updatedArticle.slug,
          description: updatedArticle.description,
          body: updatedArticle.body,
          imageUrl: updatedArticle.imageUrl,
          isDraft: updatedArticle.isDraft,
          updatedAt: updatedArticle.updatedAt
        },
      });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
}

/**
   * @description - Get all article authored by a specific user
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} article
   *
   */
  static async getAllArticlesByAUser(req, res) {
    try {
      const { userId } = req.params
      let offset = 0;
      
      const { currentPage, limit } = req.query; // page number
      const defaultLimit = limit || 3; // number of records per page

      offset = currentPage ? defaultLimit * (currentPage - 1) : 0;

      const { count, rows: articles } = await Article.findAndCountAll({
        offset,
        limit: defaultLimit,
        where: {
          userId
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      });

      const pages = Math.ceil(count / limit) || 1;

      return res.status(200).json({
        status: 200,
        message: 'All articles fetched successfully',
        data: [ 
          {
            articles,
            totalArticles: count,
            currentPage,
            limit,
            totalPages: pages
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }
}

export default ArticleController;
