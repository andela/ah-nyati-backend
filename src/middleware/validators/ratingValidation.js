import { check } from 'express-validator';
import validate from '../validate';

const ratingsChecker = [
  check('value').not().isEmpty().withMessage('Value cannot be empty'),
  check('value').isNumeric().withMessage('Value can only be numeric'),
  check('value').isInt({ min: 0, max: 5 }).withMessage('Value can only be between 0 and 5'),
  validate,
];

export default ratingsChecker;
