import { Rating } from '../db/models';

/**
  * @description - Atrticle ratings
 * @class RatingController
 */
class RatingController {
  /**
   * @description - rate an article
   * @return {object } res
   * @static
   * @param { object } req
   * @param { object } res
   * @memberof RatingController
   */
  static async rateArticle(req, res) {
    const value = Number(req.body.value);
    const id = req.user;
    const {article} = res.locals;
    const articleId = article.id

    try {

      const previousRating = await Rating.findOne({
        where: { userId: id, articleId }
      });

      if (previousRating) {
        await previousRating.update({ value });
        return res.status(200).json({
          status: 200,
          message: `Article rating has been updated as ${value} star`,
          article,
          rating: previousRating.value
        });
      }
      const rating = await Rating.create({
        userId: id,
        articleId,
        value
      });
      return res.status(200).json({
        status: 200,
        message: `Article has been rated as ${value} star`,
        article,
        rating: rating.value,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
}
export default RatingController;
