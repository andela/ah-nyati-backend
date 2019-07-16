import { sanitizeBody, body } from 'express-validator';

const reportValidator = {
  detailsValidator: [
    body('body')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Article body is required.')
      .isString()
      .withMessage('Invalid article body.')
      .isLength({ min: 1 })
      .withMessage('Article body too short.')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Article body too long.'),
    sanitizeBody('reportType')
      .customSanitizer( value => {
        if (value) {
          return value.toLowerCase();
        }
      }),
    body('reportType')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('reportType is required.')
      .isIn(['comment', 'article'])
      .withMessage('Invalid reportType.'),
    body('typeId')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('typeId is required.')
      .isInt(10)
      .withMessage('typeId must be an integer.'),
  ],
};

export default reportValidator;
