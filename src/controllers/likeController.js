import { Like } from '../db/models';

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

      await Like.create({ userId, articleId: article.id });

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
}

export default LikeController;
