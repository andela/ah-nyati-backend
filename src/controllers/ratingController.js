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
          data: [ 
            {
              articleId,
              rating: previousRating.value
            }
          ]
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
        data: [
          {
            articleId,
            rating: rating.value,
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
 *
 * @returns { object } res
 * @description - paginate article ratings
 * @static
 * @param {object} req
 * @param {object} res
 * @memberof RatingController
 */
static async getAllArticlesRating(req, res){
    const {article} = res.locals;
    const articleId = article.id
    try{
      let offset = 0;
      const { currentPage, limit } = req.query; // page number
      const defaultLimit = limit || 3; // number of records per page
      const defaultPage = currentPage || 1;

      const { count, rows: rating } = await Rating.findAndCountAll({
        where: { articleId },
        raw: true,
        attributes: { exclude: ['id', 'updatedAt', 'articleId']},
        limit: defaultLimit,
        offset
      });
      
      const pages = Math.ceil(count / limit) || 1;
      offset = limit * (defaultPage - 1);

      return res.status(200).json({
        status: 200,
        message: 'All Ratings fetched successfully',
        data: [ 
          {
            articleId,
            rating,
            totalRating: count,
            currentPage,
            limit,
            totalPages: pages
          }
        ]
      });

    } catch(error){
      return res.status(500).json({
        status: 500,
        message: error.message
      })
    }
  }
}
export default RatingController;
