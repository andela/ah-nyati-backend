import { check } from 'express-validator';
import validate from '../validate';

const tagChecker = [
  check('tagName').not().trim().isEmpty().withMessage('Value cannot be empty'),
  validate,
];

export default tagChecker;
