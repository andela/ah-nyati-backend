import { Article } from '../db/models';

/**
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
    const article = await Article.findOne({
      attributes: ['id', 'slug', 'body'],
      where: { slug },
    });
    res.locals.article = article;

    if (!article) {
      return res.status(404).json({
        status: 404,
        error: 'Article not found',
      });
    }
    return next();
  }
}

export default FindItem;
