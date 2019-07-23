import { body, check, sanitizeBody } from 'express-validator';

const authValidator = {
  passwordValidator: [
    body('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Password is required.')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password must be between 8 to 15 characters long.')
      .isAlphanumeric()
      .withMessage('Password must be alphanumeric.'),
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
  roleValidator: [
    sanitizeBody('userRole')
      .customSanitizer(value => {
      if (value) {
        return value.toLowerCase();
      }
    }),
    body('userRole')
      .trim()
      .exists({ checkNull: false, checkFalsy: false })
      .isIn(['superadmin', 'admin', 'user', ''])
      .withMessage('Invalid userRole.'),
    sanitizeBody('userRole')
      .customSanitizer(value => {
      if (value === 'superadmin') {
        const role = value.replace('a', 'A');
        return role;
      }
      return value;
    }),
  ],
  usernameValidator: [
    body('userName')
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
