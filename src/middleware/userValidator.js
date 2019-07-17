import { sanitizeBody, body, sanitizeParam, param } from 'express-validator';

const userValidator = {
  idParamValidator: [
    param('userId')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('userId param is required.')
      .matches(/^\d+$/)
      .withMessage('Invalid userId param.')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Invalid userId param.'),
    sanitizeParam('userId').toInt(),
  ],
  roleValidator: [
    sanitizeBody('userRole')
      .customSanitizer(value => value.toLowerCase()),
    body('userRole')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('userRole is required.')
      .isIn(['superadmin', 'admin', 'user'])
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
};

export default userValidator;
