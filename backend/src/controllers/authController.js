import { asyncHandler } from '../utils/errors.js';
import * as authService from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const tokens = await authService.issueTokens({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  });
  res.status(201).json({ success: true, data: tokens });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.cookie('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    success: true,
    data: { user: data.user, accessToken: data.accessToken },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const data = await authService.refreshAccessToken(token);
  res.cookie('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    success: true,
    data: { user: data.user, accessToken: data.accessToken },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  await authService.logout(token);
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.full_name,
      role: req.user.role,
    },
  });
});
