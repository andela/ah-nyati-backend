import { Category } from '../db/models';

/**
 * @description Category Controller
 * @class CategoryController
 */
class CategoryController {

    /**
       * @description - Get all categories
       * @static
       * @async
       * @param {object} req - request
       * @param {object} res - response
       * @returns {object} category
       *
       */
    static async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll({});

            return res.status(200).json({
                status: 200,
                message: 'All categories fetched successfully',
                data: [
                    {
                        categories,
                        
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
}

export default CategoryController;
