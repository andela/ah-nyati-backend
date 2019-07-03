import express from 'express';

import authValidator from '../middleware/authValidator';
import validate from '../middleware/validate';
import checkDuplicate from '../middleware/checkDuplicate';

const { usernameValidator, emailValidator, passwordValidator } = authValidator;
const { checkExistingUser } = checkDuplicate;
const authRouter = express.Router();

authRouter.post('/users', usernameValidator, emailValidator, passwordValidator, validate, checkExistingUser, (request, response) => {
  const { username, email, password } = request.body;
  response.status(201).json(
    { username, email, password }
  );
  /* eslint-disable-next-line */
  console.log('User signup successful');
});

authRouter.post('/users/login', emailValidator, passwordValidator, validate, (request, response) => {
  const { username, email, password } = request.body;
  response.status(201).send({ username, email, password });
  /* eslint-disable-next-line */
  console.log('User login successful');
});

export default authRouter;
