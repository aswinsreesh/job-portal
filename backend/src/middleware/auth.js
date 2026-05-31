import pool from '../config/db.js';
import { AppError } from '../utils/errors.js';
import { verifyAccessToken } from '../utils/tokens.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Access token required', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    const { rows } = await pool.query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [decoded.userId]
    );
    if (!rows[0]) return next(new AppError('User not found', 401));
    req.user = rows[0];
    next();
  } catch {
    next(new AppError('Invalid or expired access token', 401));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Forbidden', 403));
  }
  next();
};
