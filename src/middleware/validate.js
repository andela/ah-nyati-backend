import { validationResult } from 'express-validator';

/**
   * @description Extracts errors from validation middleware
   * @param {object} req - incoming request object
   * @param {object} res - incoming response object
   * @param {function} next - next function
   * @returns {object} validation error object
   */
const validate = (req, res, next) => {
  const errorFormatter = ({ msg }) => `${msg}`;
  const validationError = validationResult(req).formatWith(errorFormatter);

  if (!validationError.isEmpty()) {
    const errorMsg = validationError.mapped();

    return res.status(400).json({
      status: 400,
      message: errorMsg,
    });
  }
  return next();
};

export default validate;
