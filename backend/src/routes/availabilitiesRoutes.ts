import { Router } from 'express';
import {
  createAvailability,
  getAvailabilitiesByProfessional,
} from '../controllers/availabilities.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';

export const availabilitiesRouter = Router();

availabilitiesRouter.get(
  '/:id',
  [authMiddleware, authorizeRoles('professional')],
  getAvailabilitiesByProfessional,
);

availabilitiesRouter.post(
  '/',
  [authMiddleware, authorizeRoles('professional')],
  createAvailability,
);
