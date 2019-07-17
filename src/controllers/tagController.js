import { Tag } from '../db/models'

/**
 *
 * @description - Article Tagging
 * @class TagController 
 */
class TagController {
/**
* @description - Tag an article
* @return {object } res
 * @static
 * @param { object } req
 * @param { object } res
 * @memberof TagController
 */
static async tagArticles(req, res){

    const {tagName} = req.body;
    const {article} = res.locals;
    const articleId = article.id;
    

    try {
      const tags = tagName.toLowerCase().split(',');
      const whiteSpace = /\s/g;
      await Promise.all(tags.map( async tag => {
        const previousTag = await Tag.findOne({
          where: { tagName: tag, articleId }
        });

        if(previousTag) {
          return
        }
        tag = tag.replace(whiteSpace, '');
        await Tag.create({ articleId, tagName: tag })
      }));

      return res.status(201).json({
        status: 201,
        message: `Article has been tagged as ${tagName}`
      })
    }catch(error){
      return res.status(500).json({
        status: 500,
        message: error.message
        
      })
    }

  }
}
export default TagController
