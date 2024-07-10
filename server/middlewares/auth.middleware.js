import AppError from '../utils/error.util.js';  // Ensure this path is correct
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError('Please log in to access this resource', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new AppError('Invalid token, please log in again', 401));
  }
};
