import slugify from 'slugify';
import randomstring from 'randomstring';

/**
   * @description - Generates a new slug
   * @param {string} text - text for generating new slug
   * @returns {string} newly generated slug
   */
const slugGen = (text) => {
  try {
    const slugifyOptions = {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true
    };

    const randomstringOptions = {
      length: 8,
      charset: 'hex',
      capitalization: 'lowercase',
    };

    const slugTail = randomstring.generate(randomstringOptions);
    const slugTitle = slugify(text, slugifyOptions);
    const slug = slugTitle.concat('-', slugTail);

    return slug;
  } catch (error) {
    return error;
  }
};

export default slugGen;
