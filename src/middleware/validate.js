import { validationResult } from 'express-validator';

const validate = (request, response, next) => {
  const errorFormatter = ({ msg }) => [`${msg}`];
  const validationError = validationResult(request).formatWith(errorFormatter);

  if (!validationError.isEmpty()) {
    const errorMsg = validationError.mapped();

    return response.status(400).json({
      message: 'Invalid request',
      errors: errorMsg,
    });
  }
  return next();
};

export default validate;
