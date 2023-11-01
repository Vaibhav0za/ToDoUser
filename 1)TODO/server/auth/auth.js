// auth.js

import jwt from 'jsonwebtoken';

const secretKey = 'login_token';

export const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};
