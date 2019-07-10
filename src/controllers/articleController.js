import { Article, Tag, User } from '../db/models';
import slugGen from '../helpers/slugGen';
import urlExtractor from '../helpers/urlExtractor';
import tagExtractor from '../helpers/tagExtractor';
import searchHelper, { searchOutcome } from '../helpers/searchHelper';

/**
 * Article controller class
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
        error: error.message
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
  static async create(req, res) {
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
        message: 'article successfully created',
        article: newArticle
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
        error
      });
    }
  }
}

export default ArticleController;
