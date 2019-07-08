import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export const socialCallBack = (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  done(null, accessToken, profile);
};

export const generateToken = (payload, expiresIn = '7d') => jwt.sign(payload, process.env.SECRET, { expiresIn });

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
