import { body, check } from 'express-validator';

const authValidator = {
  passwordValidator: [
    body('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Password is required.')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password must be between 8 to 15 characters long.')
      .matches(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,15}$/)
      .withMessage('Password must contain a letter and a number.'),
  ],
  emailValidator: [
    check('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required.')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address.'),
  ],
  usernameValidator: [
    body('username')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Username is required.')
      .matches(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)
      .withMessage('Invalid username.')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters.'),
  ],
};

export default authValidator;
