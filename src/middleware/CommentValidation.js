import { check, param } from 'express-validator';

const commentValidation = {
  validateComment: [
    check('commentBody')
      .trim()
      .not().isEmpty()
      .withMessage('Comment body is required.'),
  ],
  validateCommentId:[
    param('id')
    .isNumeric()
    .withMessage('Comment Id must be an integer')
  ]
};

export default commentValidation;
