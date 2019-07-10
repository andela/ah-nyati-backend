/**
   * @description - Extracts image urls
   * @param {array} images - array of images object
   * @returns {string} image urls string
*/
const urlExtractor = (images) => {
  let imageUrl;

  if (images) {
    imageUrl = images.map(image => image.url).toString();
    return imageUrl;
  }
  return '';
};

export default urlExtractor;
