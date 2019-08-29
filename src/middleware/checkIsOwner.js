import { Article } from '../db/models';

/**
 * @description - checks if requester is author
 * @param {object} req the request body
 * @param {object} res the response body
 * @param {function} next passes the request to another function to be processed
 * @returns {function} next
 */
const checkIsOwner = async (req, res, next) => {
  const { slug } = req.params;
  const { role, id } = req.decodedUser;

  const article = await Article.findOne({
    where: {
      slug
    },
  });

  if (!article || article.length === 0) {
    return res.status(404).json({
      status: 404,
      error: 'Requested article does not exist'
    });
  }
  const { dataValues } = article;
  const { userId } = dataValues;

  if (role === 'user' && id !== userId) {
    return res.status(403).json({
      status: 403,
      message: `You don't have permission to perform this request!`,
    });
  }

  res.locals.article = dataValues;
  return next();
};

export default checkIsOwner;
