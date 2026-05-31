import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { validate } from '../middleware/validate.js';
import {
  applyValidator,
  createJobValidator,
  jobIdValidator,
  updateJobValidator,
} from '../validators/jobValidators.js';

const router = Router();

// Public routes
router.get('/public', jobController.listPublicJobs);
router.get('/public/featured', jobController.getFeaturedJobs);
router.get('/public/by-category', jobController.getCategoryJobs);
router.get('/categories', jobController.listCategories);
router.get(
  '/public/:id',
  jobIdValidator,
  validate,
  optionalAuth,
  jobController.getPublicJob
);

router.post(
  '/public/:id/apply',
  authenticate,
  requireRole('user'),
  jobIdValidator,
  applyValidator,
  validate,
  jobController.applyToJob
);

// Admin routes
const adminRouter = Router();
adminRouter.use(authenticate, requireRole('admin'));
adminRouter.get('/stats', jobController.dashboardStats);
adminRouter.get('/', jobController.adminListJobs);
adminRouter.get('/:id', jobIdValidator, validate, jobController.adminGetJob);
adminRouter.post('/', createJobValidator, validate, jobController.createJob);
adminRouter.put('/:id', updateJobValidator, validate, jobController.updateJob);
adminRouter.delete('/:id', jobIdValidator, validate, jobController.deleteJob);

router.use('/admin', adminRouter);

export default router;
