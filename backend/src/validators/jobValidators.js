import { body, param } from 'express-validator';

const experienceLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'];
const jobStatuses = ['draft', 'published', 'closed'];

export const jobIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
];

export const createJobValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid category is required'),
  body('experienceLevel')
    .isIn(experienceLevels)
    .withMessage('Valid experience level is required'),
  body('status')
    .optional()
    .isIn(jobStatuses)
    .withMessage('Invalid status'),
  body('salaryMin')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Salary min must be a positive number'),
  body('salaryMax')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Salary max must be a positive number'),
  body('isFeatured').optional().isBoolean(),
];

export const updateJobValidator = [
  ...jobIdValidator,
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('companyName').optional().trim().notEmpty(),
  body('location').optional().trim().notEmpty(),
  body('categoryId').optional().isInt({ min: 1 }),
  body('experienceLevel').optional().isIn(experienceLevels),
  body('status').optional().isIn(jobStatuses),
];

export const applyValidator = [
  body('coverLetter')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Cover letter must be between 20 and 2000 characters'),
];
