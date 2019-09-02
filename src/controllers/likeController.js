import { Like } from '../db/models';
import notification from '../helpers/notification';
import findItem from '../helpers/findItem';

/**
 *@description This class handles all like requests
 * @class LikeController
 */
class LikeController {
  /**
 *@description This function allows a user to like articles
 * @static
 * @param {object} req the request body
 * @param {object} res the response body
 * @returns {object} res
 * @memberof LikeController
 */
  static async likeArticle(req, res) {
    const userId = req.user;

    try {
      const { article } = res.locals;
      const articleId = article.id;

      const likedArticle = await Like.findOne({
        where: {
          articleId,
          userId,
        },
      });

      if (likedArticle) {
        await likedArticle.destroy();
        return res.status(200).json({
          status: 200,
          message: 'You just unliked this article',
          data: [ article ],
        });
      }

      await Like.create({ userId, articleId });

      // SEND ARTICLE AUTHOR NOTIFICATION ON LIKE
      const loggedInUser = await findItem.getUser(userId);
      const authorId = article.userId;
      const articleTitle = article.title;
      notification(
        authorId,
        `${loggedInUser.firstName} ${loggedInUser.lastName} like your article ${articleTitle}`
      )

      return res.status(201).json({
        status: 201,
        message: 'You just liked this article',
        data: [ article ],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

/**
 * @description This function gets all likes for an article
 * @static
 * @param {object} req
 * @param {object} res
 * @returns {object} res
 * @memberof LikeController
 */
static async getArticleLikes (req, res) {
  const { article } = res.locals;
      const articleId = article.id;

      try {
        const {count, rows: articleLikes} = await Like.findAndCountAll({
          where: {
            articleId,
          },
        });
        return res.status(200).json({
          status: 200,
          data: {
            articleLikes,
            count
          },
        });
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: error.message,
        });
      }
  }
}

export default LikeController;
