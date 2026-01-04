import { verifyToken } from '../utils/auth.js';
import { User } from '../models/index.js';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ detail: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.sub);

    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Invalid token' });
  }
};

/**
 * Middleware to handle errors
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({ detail: err.message });
  }

  return res.status(500).json({ detail: 'An internal server error occurred' });
};
