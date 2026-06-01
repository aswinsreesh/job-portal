import { asyncHandler } from '../utils/errors.js';
import * as applicationService from '../services/applicationService.js';

export const adminListApplications = asyncHandler(async (req, res) => {
  const data = await applicationService.listApplications(req.query);
  res.json({ success: true, data });
});

export const adminUpdateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.body.status
  );
  res.json({ success: true, data: application });
});
