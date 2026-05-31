import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { AppError } from '../utils/errors.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/tokens.js';

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const userSelect = 'id, email, full_name, role, created_at';

export const registerUser = async ({ email, password, fullName }) => {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [
    email,
  ]);
  if (existing.rows[0]) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, 'user') RETURNING ${userSelect}`,
    [email, passwordHash, fullName]
  );
  return rows[0];
};

export const login = async ({ email, password }) => {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1`,
    [email]
  );
  const user = rows[0];
  if (!user) throw new AppError('Invalid email or password', 401);

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError('Invalid email or password', 401);

  return issueTokens(user);
};

export const issueTokens = async (user) => {
  const payload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, tokenHash, expiresAt]
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new AppError('Refresh token required', 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  const tokenHash = hashToken(refreshToken);
  const { rows } = await pool.query(
    `SELECT rt.*, u.id, u.email, u.full_name, u.role, u.password_hash
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1 AND rt.expires_at > NOW()`,
    [tokenHash]
  );

  if (!rows[0]) throw new AppError('Refresh token revoked or expired', 401);

  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [
    tokenHash,
  ]);

  return issueTokens(rows[0]);
};

export const logout = async (refreshToken) => {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [
    tokenHash,
  ]);
};
