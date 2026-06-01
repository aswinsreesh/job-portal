import { body, param, query } from 'express-validator';

const applicationStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

export const applicationIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('Valid application ID is required'),
];

export const listApplicationsValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('jobId').optional().isInt({ min: 1 }),
  query('status').optional().isIn(applicationStatuses),
  query('search').optional().trim(),
];

export const updateApplicationStatusValidator = [
  ...applicationIdValidator,
  body('status')
    .isIn(applicationStatuses)
    .withMessage('Valid application status is required'),
];
