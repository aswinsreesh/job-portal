import pool from '../config/db.js';
import { verifyAccessToken } from '../utils/tokens.js';

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const { rows } = await pool.query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [decoded.userId]
    );
    if (rows[0]) req.user = rows[0];
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};
