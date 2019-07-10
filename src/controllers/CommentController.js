import { Comment } from '../db/models';
/**
 * @description This controller handles comment request
 * @class CommentController
 */
class CommentController {
  /**
   * @static
   * @description The create comment method
   * @param  {object} req The req object
   * @param  {object} res The res object
   * @returns {object} json res
   * @memberof CommentController
   */
  static async addCommentToArticle(req, res) {
    try {
    const articleId = res.locals.articleObject.id;
    console.log(articleId, 'eeeeeee');
    
    const { userName, bio, imageUrl } = res.locals.articleObject.User;
    const { commentBody } = req.body;
    const userId = req.user;
    
   
    const commentObject = {
      userId,
      articleId,
      commentBody
    };

    const comment = await Comment.create(commentObject);

    const { id, createdAt, updatedAt } = comment;
      return res.status(201).json({
        status: 201,
        message: 'Comment Added Successfully',
        id,
        commentBody,
        createdAt,
        updatedAt,
        author: {
          userName,
          bio,
          imageUrl
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }
}

export default CommentController;
