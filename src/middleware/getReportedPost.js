import FindItem from '../helpers/findItem';

const { findArticleById, findCommentById } = FindItem;

/**
 * @description - Finds and returns the comment or article being reported
 * @async
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - the next function
 * @returns {object} error response object 
 */
const getReportedPost = async (req, res, next) => {
  const { reportType, typeId: id } = req.body;
  let reportedPost;

  if (reportType === 'comment') {
    reportedPost = await findCommentById(id);
  } 
  else reportedPost = await findArticleById(id);

  if (!reportedPost) {
    return res.status(404).json({
      status: 404,
      message: `${reportType} not found`
    });
  }
  req.post = reportedPost;
  next();
};

export default getReportedPost;
