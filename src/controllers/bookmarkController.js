import { Bookmark } from '../db/models';

/**
 * @description - Article Bookmarks
 * @class BookmarkController
 */
class BookmarkController{
 /**
  * @description - Bookmark an article
   * @return {object } res
  * @static
  * @param { object } req
  * @param { object } res
  * @memberof BookmarkController
  */
 static async bookmarkArticles(req, res){
  const userId = req.user; 
  const {article} = res.locals;
  const articleId = article.id

  try{
    const bookmarkedArticle = await Bookmark.findOne({
      where: { userId, articleId }
    });
    if (bookmarkedArticle) {
      await bookmarkedArticle.destroy();
      return res.status(200).json({
        status: 200,
        message: 'You just unbookmarked this article',
      });
    }
    await Bookmark.create({
      userId, articleId
    });
    return res.status(200).json({
      status: 200,
      message: 'You just bookmarked this article'
    })

  }catch(error){
    return res.status(500).json({
      status: 500,
      message: error.message
    })
  }

 }

}
export default BookmarkController;