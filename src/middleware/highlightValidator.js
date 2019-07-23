import { body } from 'express-validator';

const highlightValidation = {
  validatehighlight: [
    body('highlightedWord')
      .trim()
      .not().isEmpty()
      .withMessage('highlighted Word is required.')
  ],
  validateComment: [
    body('comment')
      .trim()
      .not().isEmpty()
      .withMessage('comment is required.')
  ],
};

export default highlightValidation;
