import { check } from 'express-validator';

const commentValidation = {
  validateComment: [
    check('commentBody')
      .not().isEmpty()
      .withMessage('Comment body is required.'),
  ],
};

export default commentValidation;
