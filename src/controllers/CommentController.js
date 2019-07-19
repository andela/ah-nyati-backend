import { Comment, CommentHistory, CommentLike } from '../db/models';
import notification from '../helpers/notification';
import findItem from '../helpers/findItem';

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
  static async addCommentTocomment(req, res) {
    try {
      const articleId = res.locals.articleObject.id;
      
      const { userName, bio, imageUrl } = res.locals.articleObject.User;
      const { commentBody } = req.body;
      const userId = req.user;
      
      const commentObject = {
        userId,
        articleId,
        commentBody
      };

      const comment = await Comment.create(commentObject);
        
      // SEND ARTICLE AUTHOR NOTIFICATION ON COMMENT
      const loggedInUser = await findItem.getUser(userId);
      const authorId = res.locals.articleObject.User.id;
      const articleTitle = res.locals.article.title;
      notification(authorId, `${loggedInUser.firstName} ${loggedInUser.lastName} commented on ${articleTitle}`);

      const { id, createdAt, updatedAt } = comment;
      return res.status(201).json({
        status: 201,
        message: 'Comment added successfully',
        data: [
          {
            id,
            commentBody,
            createdAt,
            updatedAt,
            author: {
              userName,
              bio,
              imageUrl
            }
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  
  /**
   * @static
   * @description The get all comment method
   * @param  {object} req The req object
   * @param  {object} res The res object
   * @returns {object} json res
   * @memberof CommentController
   */
  static async getAllArticleComments(req, res) {
    const { article } = res.locals;
    const articleId = article.id;

    try {
      let offset = 0;
      
      const { currentPage, limit } = req.query; // page number
      const defaultLimit = limit || 3; // number of records per page

      offset = currentPage ? defaultLimit * (currentPage - 1) : 0;

      const { count, rows: comments } = await Comment.findAndCountAll({
        where: { articleId },
        raw: true,
        attributes: ['id', 'commentBody', 'createdAt'],
        limit: defaultLimit,
        offset,
      });
      const pages = Math.ceil(count / limit) || 1;

      return res.status(200).json({
        status: 200,
        message: 'All comments fetched successfully',
        data: [ 
          {
            articleId,
            comments,
            totalComments: count,
            currentPage,
            limit,
            totalPages: pages
          }
        ]
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  /**
   *@description This function allows a user to like comments
   * @static
   * @param {object} req the request body
   * @param {object} res the response body
   * @returns {object} res
   * @memberof LikeController
   */
  static async likeComment(req, res) {
    const userId = req.user;

    try {
      const { comment } = res.locals;
      const commentId = comment.id;

      const likedcomment = await CommentLike.findOne({
        where: {
          commentId,
          userId,
        },
      });

      if (likedcomment) {
        await likedcomment.destroy();
        return res.status(200).json({
          status: 200,
          message: 'You just unliked this comment',
          data: [commentId],
        });
      }

      await CommentLike.create({ userId, commentId });

      return res.status(201).json({
        status: 201,
        message: 'You just liked this comment',
        data: [commentId],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

/**
 *@description This function gets a specific comment
 * @static
 * @param {object} req
 * @param {object} res
 * @returns {object} res
 * @memberof CommentController
 */
static async getSingleComment(req, res) {
  try {
    const { comment } = res.locals;
    const { articleId } = comment;
    return res.status(200).json({
      status: 200,
      message: 'Operation successful',
      data: [{
        articleId,
        comment,
      }],
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

/**
 * @description This function edits and updates a comment
 * @static
 * @param {object} req
 * @param {object} res
 * @returns {object} res
 * @memberof CommentController
 */
static async updateComment(req, res) {
  try {
    const { comment } = res.locals;
    const { articleId } = comment;
    const { commentBody } = req.body;
    const userId = req.user;

    await CommentHistory.create({ userId, commentId: comment.id, commentBody: comment.commentBody }); 

    await comment.update({commentBody},
      { where: {
        id: comment.id,
      }
    });
    return res.status(200).json({
      status: 200,
      message: 'Comment updated successfully',
      data: [{
        articleId,
        comment,
      }]
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

/**
 * @description This function gets the edit history of a comment
 * @static
 * @param {object} req
 * @param {object} res
 * @returns {object} res
 * @memberof CommentController
 */
static async getCommentHistory(req, res) {
  try {
    const { id } = req.params;
    const { comment } = res.locals;
    const { articleId } = comment;
    let message;
    
    const editHistory = await CommentHistory.findAll({
      where: { commentId: id },
      attributes: {exclude: ['createdAt', 'updatedAt']},
    });

    if (editHistory.length === 0) {
      message = 'This comment has not been edited'
    } else {
      message = 'Operation successful';
    };
    
    return res.status(200).json({
      status: 200,
      message,
      data: [{
        comment: comment.commentBody,
        articleId,
        editHistory,
        updatedAt: comment.updatedAt,
      }]
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
}

export default CommentController;
