import FindItem from '../helpers/findItem';

const { findCategoryById } = FindItem;

/**
 * @description - checks if the category of the article exists
 * @async
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - the next function
 * @returns {object} error response object 
 */
const checkCategoryExists = async (req, res, next) => {
  const { catId } = req.body;
  const existingCategory = await findCategoryById(catId);

  if (!existingCategory) {
    return res.status(404).json({
      status: 404,
      message: `The category does not exist`
    });
  }
  next();
};

export default checkCategoryExists;
