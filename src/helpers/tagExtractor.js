/**
   * @description - Extracts tags and generates a query for creating tags
   * @param {integer} id - id of Article that owns the tags
   * @param {string} tagString - comma separated string of tags
   * @returns {array} newly generated query for tag bulk create
 */
const tagExtractor = (id, tagString) => {
  const tagArray = tagString.split(',');
  const tagQueryArray = tagArray.map(tag => ({ articleId: id, tagName: tag }));

  return tagQueryArray;
};

export default tagExtractor;
