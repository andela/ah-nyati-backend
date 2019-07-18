import {
  Article, User, Category, Tag, Sequelize
} from '../db/models';

const { Op } = Sequelize;

 /**
 * search helper class
 * @class SearchHelper
 */
class SearchHelper {
  /**
 *
 *@description search for an article by author
 * @static
 * @param {object} author search parameter
 * @returns {object} filtered article object
 * @memberof SearchHelper
 */
  static async searchByAuthor(author) {
    const result = await Article.findAll({
      include: [
        {
          model: User,
          where: {
            [Op.or]: [
              {
                userName: {
                  [Op.iLike]: `%${author}%`
                }
              },
              {
                firstName: {
                  [Op.iLike]: `%${author}%`
                }
              },
              {
                lastName: {
                  [Op.iLike]: `%${author}%`
                }
              }
            ]

          },
          attributes: {
            exclude: ['id', 'articleId', 'tagName', 'createdAt', 'updatedAt']
          }
        },
      ]
    });
    return result;
  }

  /**
 *
 *@description search for an article by category
 * @static
 * @param {object} category search parameter
 * @returns {object} filtered article object
 * @memberof SearchHelper
 */
  static async searchByCategory(category) {
    const result = await Article.findAll({
      include: [
        {
          model: Category,
          where: {
            name: {
              [Op.iLike]: `%${category}%`
            }
          },
          attributes: {
            exclude: ['id', 'name', 'slug', 'createdAt', 'updatedAt']
          }
        },
        {
          model: User,
          attributes: {
            exclude: ['id', 'password', 'isVerified', 'verificationToken', 'createdAt', 'updatedAt']
          }
        }
      ]
    });
    return result;
  }

  /**
 *
 *@description search for an article by title
 * @static
 * @param {object} Title search parameter
 * @returns {object} filtered article object
 * @memberof SearchHelper
 */
  static async searchByTitle(Title) {
    const result = await Article.findAll({
      where: {
        title: {
          [Op.iLike]: `%${Title}%`
        }
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['id', 'password', 'isVerified', 'verificationToken', 'createdAt', 'updatedAt']
          }
        }
      ]
    });
    return result;
  }

  /**
 *
 *@description search for an article by tagName
 * @static
 * @param {object} tagName search parameter
 * @returns {object} filtered article object
 * @memberof SearchHelper
 */
  static async searchByTag(tagName) {
    const result = await Article.findAll({
      include: [
        {
          model: Tag,
          where: {
            tagName: {
              [Op.iLike]: `%${tagName}%`
            }
          },
          attributes: {
            exclude: ['id', 'articleId', 'tagName', 'createdAt', 'updatedAt']
          }
        },
        {
          model: User,
          attributes: {
            exclude: ['id', 'password', 'isVerified', 'verificationToken', 'createdAt', 'updatedAt']
          }
        }
      ]
    });
    return result;
  }

  /**
 *
 *@description search for an article by user input
 * @static
 * @param {object} q search parameter
 * @returns {object} filtered article object
 * @memberof SearchHelper
 */
  static async searchByUserInput(q) {
    const result = {};
    const articleByUser = await SearchHelper.searchByAuthor(q);
    const articleByTag = await SearchHelper.searchByTag(q);
    const articleByTitle = await SearchHelper.searchByTitle(q);
    const articleByCategory = await SearchHelper.searchByCategory(q);

    [...articleByCategory, ...articleByTag, ...articleByTitle, ...articleByUser]
      .forEach((article) => { result[article.id] = article; });
    return Object.values(result);
  }
}


export const searchOutcome = (result, res, articleCount) => {
  const articles = result.map(article => article);

  return res.status(200).json({
    status: 200,
    message: 'Article retrieved',
    data: [
      {
        articles,
        articleCount
      }
    ]
  });
};

export default SearchHelper;
