import jwt from 'jsonwebtoken';
import config from '../db/config/config';

const { secret } = config;

/**
 * @description This function verifies token provided by user
 * @param {object} req the request body
 * @param {object} res the response body
 * @param {function} next passes the request to another function to be processed
 * @returns {function} next
 */
const verifyToken = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      status: 401,
      error: 'token is not provided!',
    });
  }

  try {
    const decoded = await jwt.verify(token, secret);
    req.user = decoded.id;
    if (decoded) return next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: 'Invalid token provided',
    });
  }
};

export default verifyToken;
