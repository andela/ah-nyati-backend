import { validationResult } from 'express-validator';

/**
 * @description this function displays error messages
 * @param {object} req the request body
 * @param {object} res the response body
 * @param {function} next passes the request to another function to be processed
 * @returns {function} next
 */
const displayErrors = (req, res, next) => {
  const messages = [];
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      messages.push(err.msg);
    });

    return res.status(400).json({
      status: 400,
      errors: messages,
    });
  }
  return next();
};

export default displayErrors;
