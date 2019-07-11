import { Article, Tag, User, Category, highlightComment } from '../db/models';
import slugGen from '../helpers/slugGen';
import urlExtractor from '../helpers/urlExtractor';
import tagExtractor from '../helpers/tagExtractor';
import searchHelper, { searchOutcome } from '../helpers/searchHelper';

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
      const limit = 10;
      const { next } = req.query;
      const offset = next === undefined ? 0 : next;
      const getAllArticles = await Article.findAll({
        offset,
        limit,
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

      const article = {};
      article.articles = getAllArticles;
      return res.status(200).json({
        status: 200,
        message: article
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
