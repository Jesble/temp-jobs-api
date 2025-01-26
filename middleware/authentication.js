import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { UnauthenticatedError } from '../errors/index.js';

export const auth = async (req, res, next) => {
  // Cheack for Header!
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  next();
};
